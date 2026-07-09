import { useState, useEffect } from "react";

import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress
} from "@mui/material";

import TravelExploreIcon from "@mui/icons-material/TravelExplore";

import RunbookForm from "../components/RunbookForm/RunbookForm";
import RunbookViewer from "../components/RunbookViewer/RunbookViewer";
import ExecutiveRCACard from "../components/Dashboard/ExecutiveRCACard";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardStatsCards from "../components/Dashboard/DashboardStatsCards";
import RecentAIActivity from "../components/Dashboard/RecentAIActivity";
import AIEngineStatus from "../components/Dashboard/AIEngineStatus";

import { getDashboardStatistics } from "../services/dashboardApi";
import { getSimilarIncidents } from "../services/similarApi";
import { analyzeRCA } from "../services/rcaApi";

const panelStyle = {
  borderRadius: 4,
  boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
  border: "1px solid #e5e7eb",
  background: "#ffffff"
};

const readValue = (source, keys, fallback = "N/A") => {
  if (!source || typeof source !== "object") return fallback;

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
      return source[key];
    }
  }

  return fallback;
};

const normalizeRCA = (result) => {
  const source = result?.data && typeof result.data === "object" ? result.data : result;

  return {
    severity: readValue(source, ["severity", "Severity"]),
    confidence: readValue(source, ["confidence_score", "confidence", "Confidence Score", "confidenceScore"]),
    mttr: readValue(source, ["mttr", "MTTR", "estimated_mttr"]),
    rootCause: readValue(source, ["root_cause", "Root Cause", "rootCause", "most_probable_root_cause"]),
    executiveSummary: readValue(source, ["executive_summary", "Executive Summary", "executiveSummary", "summary"])
  };
};

function Dashboard() {
  const [runbook, setRunbook] = useState("");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [similarIncidents, setSimilarIncidents] = useState([]);
  const [executiveRCA, setExecutiveRCA] = useState(null);
  const [rcaLoading, setRcaLoading] = useState(false);
  const [rcaError, setRcaError] = useState("");

  const [stats, setStats] = useState({
    total_runbooks: 0,
    ai_generated: 0,
    todays_runbooks: 0,
    database_status: "Loading..."
  });

  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    loadStatistics();

    const savedRCA = localStorage.getItem("latestExecutiveRCA");
    if (savedRCA) {
      try {
        setExecutiveRCA(JSON.parse(savedRCA));
      } catch (error) {
        console.error(error);
        localStorage.removeItem("latestExecutiveRCA");
      }
    }
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await getDashboardStatistics();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarIncidents = async (title) => {
    try {
      setSimilarLoading(true);
      const data = await getSimilarIncidents(title);
      setSimilarIncidents(data);
    } catch (err) {
      console.error(err);
      setSimilarIncidents([]);
    } finally {
      setSimilarLoading(false);
    }
  };

  const loadExecutiveRCA = async ({ title, commands, generatedRunbook }) => {
    try {
      setRcaLoading(true);
      setRcaError("");
      setExecutiveRCA(null);

      const result = await analyzeRCA({
        incident_title: title,
        commands,
        runbook: generatedRunbook
      });

      const normalized = normalizeRCA(result);

      setExecutiveRCA(normalized);
      localStorage.setItem("latestExecutiveRCA", JSON.stringify(normalized));
    } catch (error) {
      console.error(error);
      setExecutiveRCA(null);
      setRcaError("RCA analysis failed. Please confirm the backend /rca/analyze API is running.");
    } finally {
      setRcaLoading(false);
    }
  };

  const handleRunbookGenerated = async (payload) => {
    setRunbook(payload.runbook);
    setIncidentTitle(payload.incidentTitle);

    await loadStatistics();
    await loadSimilarIncidents(payload.incidentTitle);

    await loadExecutiveRCA({
      title: payload.incidentTitle,
      commands: payload.commands,
      generatedRunbook: payload.runbook
    });
  };

  const clearDashboardOutput = () => {
    setRunbook("");
    setIncidentTitle("");
    setSimilarIncidents([]);
    setExecutiveRCA(null);
    setRcaError("");
    localStorage.removeItem("latestExecutiveRCA");
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "success";
    if (score >= 45) return "warning";
    return "default";
  };

  const getProgressColor = (score) => {
    if (score >= 70) return "#16a34a";
    if (score >= 45) return "#f59e0b";
    return "#64748b";
  };

  return (
    <Box>
      <DashboardHeader />

      <DashboardStatsCards stats={stats} loading={loading} />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ ...panelStyle, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
              Generate New Incident Intelligence
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
              Enter an incident and diagnostic commands to generate AI runbook, RCA, and insights.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <RunbookForm onRunbookGenerated={handleRunbookGenerated} />
          </Paper>

          <Paper sx={{ ...panelStyle, p: 3, mt: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <TravelExploreIcon sx={{ color: "#2563eb" }} />

              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Similar Incident Intelligence
              </Typography>
            </Stack>

            {!incidentTitle && (
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Generate a runbook to see similar historical incidents.
              </Typography>
            )}

            {incidentTitle && similarLoading && (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={26} />
              </Box>
            )}

            {incidentTitle && !similarLoading && similarIncidents.length === 0 && (
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                No similar incidents found.
              </Typography>
            )}

            {incidentTitle && !similarLoading && similarIncidents.length > 0 && (
              <List disablePadding>
                {similarIncidents.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 3,
                      mb: 1.5,
                      background: "#f8fafc",
                      display: "block",
                      p: 2
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <ListItemText
                        primary={item.incident}
                        secondary={item.created_at}
                        primaryTypographyProps={{
                          fontWeight: 900,
                          color: "#0f172a"
                        }}
                        secondaryTypographyProps={{
                          color: "#64748b"
                        }}
                      />

                      <Chip
                        label={`${item.score}% Match`}
                        color={getScoreColor(item.score)}
                        variant="outlined"
                        sx={{ fontWeight: 900 }}
                      />
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={item.score}
                      sx={{
                        height: 8,
                        borderRadius: 10,
                        backgroundColor: "#e5e7eb",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 10,
                          backgroundColor: getProgressColor(item.score)
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          <ExecutiveRCACard
            incidentTitle={incidentTitle}
            executiveRCA={executiveRCA}
            rcaLoading={rcaLoading}
            rcaError={rcaError}
          />
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ ...panelStyle, p: 3, minHeight: 420 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
              Generated Runbook
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
              AI incident intelligence output will appear here after successful generation.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <RunbookViewer
              runbook={runbook}
              title={incidentTitle || "AI Runbook"}
              onClear={clearDashboardOutput}
            />
          </Paper>

          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <AIEngineStatus />
            </Grid>

            <Grid item xs={12} md={6}>
              <RecentAIActivity />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;