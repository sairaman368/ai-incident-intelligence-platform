import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";

import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

import { Link } from "react-router-dom";

function DashboardHeader() {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  const statusItems = [
    {
      label: "Healthy",
      icon: <HealthAndSafetyOutlinedIcon fontSize="small" />,
      background: "#dcfce7",
      color: "#166534"
    },
    {
      label: "AI Online",
      icon: <SmartToyOutlinedIcon fontSize="small" />,
      background: "#dbeafe",
      color: "#1d4ed8"
    },
    {
      label: "SQLite",
      icon: <StorageOutlinedIcon fontSize="small" />,
      background: "#ede9fe",
      color: "#6d28d9"
    },
    {
      label: "Qwen 2.5:3B",
      icon: <MemoryOutlinedIcon fontSize="small" />,
      background: "#fef3c7",
      color: "#92400e"
    },
    {
      label: `Updated ${currentTime}`,
      icon: <AccessTimeOutlinedIcon fontSize="small" />,
      background: "#e2e8f0",
      color: "#334155"
    }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #dbeafe",
        background:
          "linear-gradient(135deg, #eff6ff 0%, #ffffff 48%, #f8fafc 100%)",
        boxShadow: "0 8px 24px rgba(15,23,42,0.07)",
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          px: {
            xs: 1.5,
            sm: 2
          },
          py: {
            xs: 1.5,
            sm: 1.75
          }
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row"
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center"
          }}
          spacing={1.5}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                color: "#ffffff",
                background:
                  "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                boxShadow: "0 6px 16px rgba(37,99,235,0.22)",
                flexShrink: 0
              }}
            >
              <AutoAwesomeOutlinedIcon fontSize="small" />
            </Box>

            <Box>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row"
                }}
                spacing={0.75}
                alignItems={{
                  xs: "flex-start",
                  sm: "center"
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 950,
                    color: "#0f172a",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em"
                  }}
                >
                  Enterprise Operations Center
                </Typography>

                <Chip
                  label="Enterprise Edition"
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 23,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#1d4ed8",
                    borderColor: "#93c5fd",
                    backgroundColor: "#eff6ff"
                  }}
                />
              </Stack>

              <Typography
                variant="caption"
                sx={{
                  mt: 0.25,
                  display: "block",
                  color: "#64748b",
                  lineHeight: 1.35
                }}
              >
                Live incident intelligence, AI analysis, risk and operational
                status.
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
          >
            <Tooltip title="View analytics">
              <IconButton
                component={Link}
                to="/analytics"
                size="small"
                sx={{
                  width: 34,
                  height: 34,
                  border: "1px solid #dbeafe",
                  backgroundColor: "#ffffff",
                  color: "#1d4ed8",
                  "&:hover": {
                    backgroundColor: "#eff6ff"
                  }
                }}
              >
                <AnalyticsOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="View incident history">
              <IconButton
                component={Link}
                to="/history"
                size="small"
                sx={{
                  width: 34,
                  height: 34,
                  border: "1px solid #dbeafe",
                  backgroundColor: "#ffffff",
                  color: "#1d4ed8",
                  "&:hover": {
                    backgroundColor: "#eff6ff"
                  }
                }}
              >
                <HistoryOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={0.75}
          sx={{
            mt: 1.25
          }}
        >
          {statusItems.map((item) => (
            <Chip
              key={item.label}
              label={item.label}
              icon={item.icon}
              size="small"
              sx={{
                height: 25,
                fontSize: "0.7rem",
                fontWeight: 800,
                backgroundColor: item.background,
                color: item.color,
                "& .MuiChip-icon": {
                  color: "inherit"
                }
              }}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}

export default DashboardHeader;