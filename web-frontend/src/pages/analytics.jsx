import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@mui/material";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import StorageIcon from "@mui/icons-material/Storage";
import RefreshIcon from "@mui/icons-material/Refresh";
import BoltIcon from "@mui/icons-material/Bolt";
import TimelineIcon from "@mui/icons-material/Timeline";

import { Line, Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { getAnalytics } from "../services/analyticsApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

const panelStyle = {
  borderRadius: 4,
  boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
  border: "1px solid #e5e7eb",
  background: "#ffffff"
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom"
    }
  }
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setAnalytics(data);
      setError("");
    } catch (err) {
      console.error("Analytics Error:", err);
      setError(err.message || "Unable to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const summary = analytics?.summary || {};

  const kpiCards = [
    {
      title: "Total Runbooks",
      value: summary.total_runbooks || 0,
      subtitle: "Generated runbooks",
      icon: <AssignmentTurnedInIcon />,
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      title: "Resolved",
      value: summary.resolved_incidents || 0,
      subtitle: "Completed incidents",
      icon: <CheckCircleIcon />,
      color: "#16a34a",
      bg: "#f0fdf4"
    },
    {
      title: "Today",
      value: summary.todays_runbooks || 0,
      subtitle: "Runbooks today",
      icon: <BoltIcon />,
      color: "#f59e0b",
      bg: "#fffbeb"
    },
    {
      title: "Success Rate",
      value: `${summary.success_rate || 0}%`,
      subtitle: "AI generation success",
      icon: <TrendingUpIcon />,
      color: "#7c3aed",
      bg: "#f5f3ff"
    }
  ];

  const runbookChart = {
    labels: analytics?.runbooks_per_day?.map((item) => item.date) || [],
    datasets: [
      {
        label: "Runbooks Created",
        data: analytics?.runbooks_per_day?.map((item) => item.count) || [],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.15)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const incidentChart = {
    labels: analytics?.top_incidents?.map((item) => item.name) || [],
    datasets: [
      {
        data: analytics?.top_incidents?.map((item) => item.count) || [],
        backgroundColor: ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#7c3aed"]
      }
    ]
  };

  const commandChart = {
    labels: analytics?.top_commands?.map((item) => item.command) || [],
    datasets: [
      {
        label: "Usage Count",
        data: analytics?.top_commands?.map((item) => item.count) || [],
        backgroundColor: "#2563eb",
        borderRadius: 8
      }
    ]
  };

  return (
    <Box>
      <Paper
        sx={{
          ...panelStyle,
          p: 4,
          mb: 3,
          background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
          color: "#ffffff"
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900 }}>
              Enterprise Analytics
            </Typography>

            <Typography sx={{ mt: 1, color: "#dbeafe" }}>
              Operations intelligence for AI-generated incident runbooks
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip label="Live SQLite Data" sx={{ color: "#fff", borderColor: "#93c5fd" }} variant="outlined" />
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadAnalytics}
              sx={{
                background: "#ffffff",
                color: "#1d4ed8",
                fontWeight: 700,
                "&:hover": {
                  background: "#e0ecff"
                }
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, color: "#bfdbfe" }}>
          Last Updated: {summary.last_updated || "N/A"}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {kpiCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={panelStyle}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
                      {card.title}
                    </Typography>

                    <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a", mt: 1 }}>
                      {card.value}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                      {card.subtitle}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: 3,
                      background: card.bg,
                      color: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {card.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ ...panelStyle, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Runbook Trend
            </Typography>
            <Line data={runbookChart} options={chartOptions} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ ...panelStyle, p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              AI Health
            </Typography>

            <Stack spacing={2}>
              <Chip
                icon={<SmartToyIcon />}
                label={`Model: ${summary.ai_model || "qwen2.5:3b"}`}
                color="primary"
                variant="outlined"
              />

              <Chip
                icon={<StorageIcon />}
                label={`Database: ${summary.database_status || "Connected"}`}
                color="success"
                variant="outlined"
              />

              <Chip
                icon={<CheckCircleIcon />}
                label={`Ollama: ${summary.ollama_status || "Configured"}`}
                color="success"
                variant="outlined"
              />

              <Divider />

              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Most Common Incident
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {summary.most_common_incident || "N/A"}
              </Typography>

              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Last Generated
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {summary.last_generated || "N/A"}
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ ...panelStyle, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Top Incidents
            </Typography>
            <Pie data={incidentChart} options={chartOptions} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ ...panelStyle, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Top Commands
            </Typography>
            <Bar data={commandChart} options={chartOptions} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ ...panelStyle, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Recent Activity
            </Typography>

            <List>
              {analytics?.recent_runbooks?.slice(0, 6).map((row, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                  <ListItemIcon>
                    <TimelineIcon sx={{ color: "#2563eb" }} />
                  </ListItemIcon>

                  <ListItemText
                    primary={row.incident}
                    secondary={row.date}
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={panelStyle}>
            <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Recent Runbooks
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 800 }}>Incident</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Created At</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {analytics?.recent_runbooks?.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{row.incident}</TableCell>

                      <TableCell>
                        <Chip label={row.status} size="small" color="success" variant="outlined" />
                      </TableCell>

                      <TableCell>{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}