import React, { useCallback, useEffect, useMemo, useState } from "react";

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
    background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
    iconBackground: "#dbeafe",
    chipBackground: "#dbeafe",
    chipColor: "#1d4ed8"
  },
  success: {
    accent: "#16a34a",
    background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
    iconBackground: "#dcfce7",
    chipBackground: "#dcfce7",
    chipColor: "#166534"
  },
  warning: {
    accent: "#d97706",
    background: "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)",
    iconBackground: "#fef3c7",
    chipBackground: "#fef3c7",
    chipColor: "#92400e"
  },
  info: {
    accent: "#0891b2",
    background: "linear-gradient(135deg, #ecfeff 0%, #ffffff 100%)",
    iconBackground: "#cffafe",
    chipBackground: "#cffafe",
    chipColor: "#155e75"
  },
  default: {
    accent: "#64748b",
    background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
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
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        boxShadow: "0 12px 30px rgba(15,23,42,0.07)",
        background: tone.background,
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 18px 38px rgba(15,23,42,0.12)"
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              backgroundColor: tone.iconBackground,
              color: tone.accent,
              flexShrink: 0
            }}
          >
            <Icon />
          </Box>

          <Chip
            label={card.status || "Unknown"}
            size="small"
            sx={{
              fontWeight: 800,
              backgroundColor: tone.chipBackground,
              color: tone.chipColor
            }}
          />
        </Stack>

        <Typography
          variant="h4"
          sx={{
            mt: 2.5,
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1.1,
            wordBreak: "break-word"
          }}
        >
          {card.value ?? "N/A"}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mt: 0.8,
            fontWeight: 800,
            color: "#1e293b"
          }}
        >
          {card.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "#64748b",
            lineHeight: 1.6
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

  const cards = useMemo(() => healthData?.cards || [], [healthData]);

  const summary = healthData?.summary || {};

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid #e5e7eb",
          boxShadow: "0 14px 35px rgba(15,23,42,0.08)"
        }}
      >
        <CardContent sx={{ py: 7 }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={34} />
            <Typography color="text.secondary">
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
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <HealthAndSafetyOutlinedIcon sx={{ color: "#2563eb" }} />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "#0f172a"
              }}
            >
              Enterprise Platform Health
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              mt: 0.7,
              color: "#64748b"
            }}
          >
            Live operational status across incidents, AI services, and database.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.2} alignItems="center">
          <Chip
            icon={<CheckCircleOutlineRoundedIcon />}
            label={summary.platform_health || "Unknown"}
            sx={{
              fontWeight: 800,
              backgroundColor:
                summary.platform_health === "Healthy" ? "#dcfce7" : "#fef3c7",
              color:
                summary.platform_health === "Healthy" ? "#166534" : "#92400e"
            }}
          />

          <Tooltip title="Refresh platform health">
            <IconButton
              onClick={loadPlatformHealth}
              sx={{
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#f8fafc"
                }
              }}
            >
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
            borderRadius: 3
          }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} lg={4} key={card.title}>
            <HealthMetricCard card={card} />
          </Grid>
        ))}
      </Grid>

      {cards.length === 0 && !error && (
        <Alert
          severity="info"
          sx={{
            borderRadius: 3
          }}
        >
          No platform health metrics are currently available.
        </Alert>
      )}
    </Box>
  );
}