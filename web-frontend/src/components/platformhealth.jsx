import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import { getPlatformHealth } from "../services/dashboardApi";

const toneStyles = {
  primary: {
    accent: "#2563eb",
    background: "#eff6ff",
    iconBackground: "#dbeafe",
    chipBackground: "#dbeafe",
    chipColor: "#1d4ed8"
  },
  success: {
    accent: "#16a34a",
    background: "#f0fdf4",
    iconBackground: "#dcfce7",
    chipBackground: "#dcfce7",
    chipColor: "#166534"
  },
  warning: {
    accent: "#d97706",
    background: "#fffbeb",
    iconBackground: "#fef3c7",
    chipBackground: "#fef3c7",
    chipColor: "#92400e"
  },
  info: {
    accent: "#0891b2",
    background: "#ecfeff",
    iconBackground: "#cffafe",
    chipBackground: "#cffafe",
    chipColor: "#155e75"
  },
  default: {
    accent: "#64748b",
    background: "#f8fafc",
    iconBackground: "#e2e8f0",
    chipBackground: "#e2e8f0",
    chipColor: "#334155"
  }
};

const cardIcons = {
  "Total Incidents": AssessmentOutlinedIcon,
  "Open Incidents": WarningAmberRoundedIcon,
  "AI Success Rate": CheckCircleOutlineRoundedIcon,
  "Avg RCA Time": SpeedRoundedIcon,
  Database: StorageRoundedIcon,
  "AI Model": SmartToyOutlinedIcon
};

function HealthMetricCard({ card }) {
  const tone = toneStyles[card.tone] || toneStyles.default;
  const Icon = cardIcons[card.title] || HealthAndSafetyOutlinedIcon;

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 132,
        borderRadius: 2.5,
        border: "1px solid #e5e7eb",
        boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
        background: tone.background,
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 22px rgba(15,23,42,0.1)"
        }
      }}
    >
      <CardContent
        sx={{
          p: 1.75,
          "&:last-child": {
            pb: 1.75
          }
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              backgroundColor: tone.iconBackground,
              color: tone.accent,
              flexShrink: 0
            }}
          >
            <Icon fontSize="small" />
          </Box>

          <Chip
            label={card.status || "Unknown"}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.7rem",
              fontWeight: 800,
              backgroundColor: tone.chipBackground,
              color: tone.chipColor
            }}
          />
        </Stack>

        <Typography
          variant="h6"
          sx={{
            mt: 1.25,
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1.1,
            wordBreak: "break-word"
          }}
        >
          {card.value ?? "N/A"}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.35,
            fontWeight: 800,
            color: "#1e293b"
          }}
        >
          {card.title}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            mt: 0.35,
            display: "block",
            color: "#64748b",
            lineHeight: 1.35
          }}
        >
          {card.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function PlatformHealth() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState("");

  const loadPlatformHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPlatformHealth();

      setHealthData(response?.data || null);
    } catch (requestError) {
      console.error("Platform health request failed:", requestError);
      setHealthData(null);
      setError(
        "Unable to load platform health. Confirm the backend is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlatformHealth();
  }, [loadPlatformHealth]);

  const cards = useMemo(
    () => healthData?.cards || [],
    [healthData]
  );

  const summary = healthData?.summary || {};

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 20px rgba(15,23,42,0.06)"
        }}
      >
        <CardContent sx={{ py: 3 }}>
          <Stack alignItems="center" spacing={1}>
            <CircularProgress size={28} />

            <Typography variant="body2" color="text.secondary">
              Loading platform health...
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1}
        sx={{ mb: 1.5 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <HealthAndSafetyOutlinedIcon
              fontSize="small"
              sx={{ color: "#2563eb" }}
            />

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: "#0f172a"
              }}
            >
              Enterprise Platform Health
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            sx={{
              mt: 0.25,
              display: "block",
              color: "#64748b"
            }}
          >
            Live operational status across incidents, AI services and
            database.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            icon={<CheckCircleOutlineRoundedIcon />}
            label={summary.platform_health || "Unknown"}
            size="small"
            sx={{
              height: 26,
              fontWeight: 800,
              backgroundColor:
                summary.platform_health === "Healthy"
                  ? "#dcfce7"
                  : "#fef3c7",
              color:
                summary.platform_health === "Healthy"
                  ? "#166534"
                  : "#92400e"
            }}
          />

          <Tooltip title="Refresh platform health">
            <IconButton
              size="small"
              onClick={loadPlatformHealth}
              sx={{
                width: 30,
                height: 30,
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#f8fafc"
                }
              }}
            >
              <RefreshRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 1.5,
            py: 0.25,
            borderRadius: 2
          }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={1.5}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} xl={2} key={card.title}>
            <HealthMetricCard card={card} />
          </Grid>
        ))}
      </Grid>

      {cards.length === 0 && !error && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No platform health metrics are currently available.
        </Alert>
      )}
    </Box>
  );
}