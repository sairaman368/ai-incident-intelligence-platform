import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HistoryIcon from "@mui/icons-material/History";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import StorageIcon from "@mui/icons-material/Storage";
import MemoryIcon from "@mui/icons-material/Memory";

import { Link } from "react-router-dom";

function DashboardHeader() {
  const statusItems = [
    {
      label: "Platform Health",
      value: "Healthy",
      icon: <HealthAndSafetyIcon fontSize="small" />,
      color: "#22c55e"
    },
    {
      label: "AI Engine",
      value: "Online",
      icon: <SmartToyIcon fontSize="small" />,
      color: "#38bdf8"
    },
    {
      label: "Database",
      value: "Connected",
      icon: <StorageIcon fontSize="small" />,
      color: "#a78bfa"
    },
    {
      label: "Model",
      value: "Qwen 2.5:3B",
      icon: <MemoryIcon fontSize="small" />,
      color: "#facc15"
    }
  ];

  return (
    <Paper
      sx={{
        borderRadius: 5,
        overflow: "hidden",
        mb: 3,
        background: "linear-gradient(135deg, #020617 0%, #1e3a8a 45%, #2563eb 100%)",
        color: "#ffffff",
        boxShadow: "0 22px 55px rgba(15,23,42,0.22)",
        border: "1px solid rgba(147,197,253,0.35)"
      }}
    >
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={3}
        >
          <Box>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <AutoAwesomeIcon sx={{ fontSize: 34 }} />

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 950,
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em"
                }}
              >
                AI Incident Intelligence Platform
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 1.3,
                color: "#dbeafe",
                maxWidth: 760,
                fontSize: 17,
                lineHeight: 1.7
              }}
            >
              Enterprise AIOps workspace for runbook generation, executive RCA,
              similar incident intelligence, analytics, and operational insights.
            </Typography>
          </Box>

          <Chip
            label="Enterprise Portfolio Build"
            variant="outlined"
            sx={{
              color: "#ffffff",
              borderColor: "#93c5fd",
              fontWeight: 800,
              fontSize: 14,
              px: 1,
              height: 36,
              background: "rgba(255,255,255,0.08)"
            }}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mt: 3 }}
        >
          <Button
            component={Link}
            to="/analytics"
            variant="contained"
            startIcon={<AnalyticsIcon />}
            sx={{
              background: "#ffffff",
              color: "#1d4ed8",
              fontWeight: 900,
              borderRadius: 3,
              px: 2.5,
              "&:hover": {
                background: "#e0ecff"
              }
            }}
          >
            View Analytics
          </Button>

          <Button
            component={Link}
            to="/history"
            variant="outlined"
            startIcon={<HistoryIcon />}
            sx={{
              color: "#ffffff",
              borderColor: "#93c5fd",
              fontWeight: 900,
              borderRadius: 3,
              px: 2.5,
              "&:hover": {
                borderColor: "#ffffff",
                background: "rgba(255,255,255,0.08)"
              }
            }}
          >
            Incident History
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.14)" }} />

      <Box sx={{ px: { xs: 3, md: 4 }, py: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
        >
          {statusItems.map((item) => (
            <Box
              key={item.label}
              sx={{
                flex: 1,
                p: 1.7,
                borderRadius: 3,
                background: "rgba(15,23,42,0.32)",
                border: "1px solid rgba(255,255,255,0.12)"
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 2,
                    background: `${item.color}22`,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {item.icon}
                </Box>

                <Box>
                  <Typography sx={{ color: "#bfdbfe", fontSize: 12, fontWeight: 800 }}>
                    {item.label}
                  </Typography>

                  <Typography sx={{ color: "#ffffff", fontWeight: 900 }}>
                    {item.value}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}

export default DashboardHeader;