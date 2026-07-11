import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Divider,
  Grid,
  Paper,
  Typography
} from "@mui/material";

import PlatformHealth from "../components/PlatformHealth";
import EnterpriseIncidentTimeline from "../components/enterpriseincidenttimeline";
import SimilarIncidentIntelligence from "../components/similarincidentintelligence";
import AICopilot from "../components/aicopilot";
import RunbookForm from "../components/RunbookForm/RunbookForm";
import RunbookViewer from "../components/RunbookViewer/RunbookViewer";
import ExecutiveRCACard from "../components/Dashboard/ExecutiveRCACard";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import RecentAIActivity from "../components/Dashboard/RecentAIActivity";
import AIEngineStatus from "../components/Dashboard/AIEngineStatus";

import { getSimilarIncidents } from "../services/similarApi";
import { analyzeRCA } from "../services/rcaApi";

const panelStyle = {
  borderRadius: 4,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  boxShadow: "0 14px 35px rgba(15,23,42,0.08)"
};

const readValue = (source, keys, fallback = "N/A") => {
  if (!source || typeof source !== "object") {
    return fallback;
  }

  for (const key of keys) {
    const value = source[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
};

const normalizeRCA = (result) => {
  const source =
    result?.data && typeof result.data === "object"
      ? result.data
      : result;

  return {
    severity: readValue(source, ["severity", "Severity"]),
    confidence: readValue(source, [
      "confidence_score",
      "confidence",
      "Confidence Score",
      "confidenceScore"
    ]),
    mttr: readValue(source, [
      "mttr",
      "MTTR",
      "estimated_mttr"
    ]),
    rootCause: readValue(source, [
      "root_cause",
      "Root Cause",
      "rootCause",
      "most_probable_root_cause"
    ]),
    executiveSummary: readValue(source, [
      "executive_summary",
      "Executive Summary",
      "executiveSummary",
      "summary"
    ])
  };
};

function Dashboard() {
  const [runbook, setRunbook] = useState("");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [similarIncidents, setSimilarIncidents] = useState([]);
  const [executiveRCA, setExecutiveRCA] = useState(null);

  const [similarLoading, setSimilarLoading] = useState(false);
  const [rcaLoading, setRcaLoading] = useState(false);

  const [rcaError, setRcaError] = useState("");
  const [dashboardError, setDashboardError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const savedRCA = localStorage.getItem("latestExecutiveRCA");

    if (!savedRCA) {
      return;
    }

    try {
      setExecutiveRCA(JSON.parse(savedRCA));
    } catch (error) {
      console.error("Unable to restore Executive RCA:", error);
      localStorage.removeItem("latestExecutiveRCA");
    }
  }, []);

  const loadSimilarIncidents = async (title) => {
    try {
      setSimilarLoading(true);

      const response = await getSimilarIncidents(title);

      const incidents = Array.isArray(response)
        ? response
        : response?.data || [];

      setSimilarIncidents(incidents);
    } catch (error) {
      console.error("Similar incident lookup failed:", error);
      setSimilarIncidents([]);
    } finally {
      setSimilarLoading(false);
    }
  };

  const loadExecutiveRCA = async ({
    title,
    commands,
    generatedRunbook
  }) => {
    try {
      setRcaLoading(true);
      setRcaError("");
      setExecutiveRCA(null);

      const result = await analyzeRCA({
        incident_title: title,
        commands,
        runbook: generatedRunbook
      });

      const normalizedRCA = normalizeRCA(result);

      setExecutiveRCA(normalizedRCA);

      localStorage.setItem(
        "latestExecutiveRCA",
        JSON.stringify(normalizedRCA)
      );
    } catch (error) {
      console.error("Executive RCA generation failed:", error);

      setExecutiveRCA(null);
      setRcaError(
        "RCA analysis failed. Confirm the backend and Ollama services are running."
      );
    } finally {
      setRcaLoading(false);
    }
  };

  const handleRunbookGenerated = async (payload) => {
    const generatedRunbook = payload?.runbook || "";

    const title =
      payload?.incidentTitle ||
      payload?.incident_title ||
      "Untitled Incident";

    const commands = payload?.commands || "";

    setDashboardError("");
    setRunbook(generatedRunbook);
    setIncidentTitle(title);
    setIncidentDescription(commands);

    try {
      await Promise.all([
        loadSimilarIncidents(title),
        loadExecutiveRCA({
          title,
          commands,
          generatedRunbook
        })
      ]);
    } catch (error) {
      console.error("Dashboard refresh failed:", error);

      setDashboardError(
        "The runbook was generated, but one or more dashboard services could not refresh."
      );
    } finally {
      setRefreshKey((currentValue) => currentValue + 1);
    }
  };

  const clearDashboardOutput = () => {
    setRunbook("");
    setIncidentTitle("");
    setIncidentDescription("");
    setSimilarIncidents([]);
    setExecutiveRCA(null);
    setRcaError("");
    setDashboardError("");

    localStorage.removeItem("latestExecutiveRCA");
  };

  return (
    <Box>
      <DashboardHeader />

      <Box sx={{ mt: 3 }}>
        <PlatformHealth key={`platform-health-${refreshKey}`} />
      </Box>

      {dashboardError && (
        <Alert
          severity="warning"
          sx={{
            mt: 3,
            borderRadius: 3
          }}
        >
          {dashboardError}
        </Alert>
      )}

      <Box sx={{ mt: 3 }}>
        <EnterpriseIncidentTimeline
          key={`incident-timeline-${refreshKey}`}
        />
      </Box>

      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid item xs={12} lg={5}>
          <Paper sx={{ ...panelStyle, p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                mb: 1
              }}
            >
              Generate New Incident Intelligence
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 2
              }}
            >
              Enter the incident details and diagnostic commands to
              generate an AI runbook, executive RCA, and operational
              insights.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <RunbookForm
              onRunbookGenerated={handleRunbookGenerated}
            />
          </Paper>

          <ExecutiveRCACard
            incidentTitle={incidentTitle}
            executiveRCA={executiveRCA}
            rcaLoading={rcaLoading}
            rcaError={rcaError}
          />
        </Grid>

        <Grid item xs={12} lg={7}>
          <Paper
            sx={{
              ...panelStyle,
              p: 3,
              minHeight: 460
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                mb: 1
              }}
            >
              Generated Runbook
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 2
              }}
            >
              AI-generated diagnostic, recovery, validation, rollback,
              and preventive actions appear here.
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
              <RecentAIActivity
                key={`activity-${refreshKey}`}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
<Box sx={{ mt: 3 }}>
  <AICopilot
    incidentTitle={incidentTitle}
    incidentDescription={incidentDescription}
    runbook={runbook}
  />
</Box>
      <Box sx={{ mt: 3 }}>
        <SimilarIncidentIntelligence
          incidentTitle={incidentTitle}
          loading={similarLoading}
          incidents={similarIncidents}
        />
      </Box>
    </Box>
  );
}

export default Dashboard;