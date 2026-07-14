import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Divider,
  Paper,
  Typography
} from "@mui/material";

import PlatformHealth from "../components/PlatformHealth";
import EnterpriseIncidentTimeline from "../components/enterpriseincidenttimeline";
import SimilarIncidentIntelligence from "../components/similarincidentintelligence";
import AICopilot from "../components/aicopilot";
import IncidentRiskScore from "../components/incidentriskscore";
import RunbookForm from "../components/RunbookForm/RunbookForm";
import RunbookViewer from "../components/RunbookViewer/RunbookViewer";
import ExecutiveRCACard from "../components/Dashboard/ExecutiveRCACard";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import RecentAIActivity from "../components/Dashboard/RecentAIActivity";
import AIEngineStatus from "../components/Dashboard/AIEngineStatus";

import DashboardContainer from "../components/layout/dashboardcontainer";
import DashboardSection from "../components/layout/dashboardsection";
import {
  DashboardColumn,
  DashboardRow
} from "../components/layout/dashboardgrid";
import DashboardCard from "../components/common/dashboardcard";

import { getSimilarIncidents } from "../services/similarApi";
import { analyzeRCA } from "../services/rcaApi";

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
  const [incidentId, setIncidentId] = useState(null);
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
  incidentId,
  title,
  commands,
  generatedRunbook
}) => {
    try {
      setRcaLoading(true);
      setRcaError("");
      setExecutiveRCA(null);

      const result = await analyzeRCA({
        incident_id: incidentId,
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
    const generatedIncidentId =
      payload?.incidentId || payload?.incident_id;

    const title =
      payload?.incidentTitle ||
      payload?.incident_title ||
      "Untitled Incident";

    const commands = payload?.commands || "";

    setDashboardError("");
    setIncidentId(generatedIncidentId);
    setRunbook(generatedRunbook);
    setIncidentTitle(title);
    setIncidentDescription(commands);

    try {
      await Promise.all([
        loadSimilarIncidents(title),
        loadExecutiveRCA({
          incidentId: generatedIncidentId,
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
      setRefreshKey((value) => value + 1);
    }
  };

  const clearDashboardOutput = () => {
    setIncidentId(null);
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
    <DashboardContainer compact>
      <DashboardHeader />

      <DashboardSection compact>
        <PlatformHealth key={`platform-health-${refreshKey}`} />
      </DashboardSection>

      {dashboardError && (
        <Alert
          severity="warning"
          sx={{
            mt: 1.5,
            borderRadius: 2
          }}
        >
          {dashboardError}
        </Alert>
      )}

      <DashboardSection
        title="Incident Intelligence Workspace"
        subtitle="Generate, analyse, assess and review incident intelligence."
        compact
      >
        <DashboardRow spacing={2}>
          <DashboardColumn xs={12} lg={4}>
            <DashboardCard compact>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 900,
                  color: "#0f172a",
                  mb: 0.5
                }}
              >
                Generate New Incident Intelligence
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#64748b",
                  mb: 1.25,
                  lineHeight: 1.45
                }}
              >
                Enter incident details and diagnostic commands to generate
                the runbook, RCA and operational insights.
              </Typography>

              <Divider sx={{ mb: 1.25 }} />

              <RunbookForm
                onRunbookGenerated={handleRunbookGenerated}
              />
            </DashboardCard>
          </DashboardColumn>

          <DashboardColumn xs={12} lg={8}>
            <DashboardCard
              compact
              scrollable
              sx={{
                minHeight: 360,
                maxHeight: 520
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 900,
                  color: "#0f172a",
                  mb: 0.5
                }}
              >
                Generated Runbook
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#64748b",
                  mb: 1.25,
                  lineHeight: 1.45
                }}
              >
                AI-generated diagnosis, recovery, validation, rollback and
                preventive guidance.
              </Typography>

              <Divider sx={{ mb: 1.25 }} />

              <RunbookViewer
                runbook={runbook}
                title={incidentTitle || "AI Runbook"}
                onClear={clearDashboardOutput}
              />
            </DashboardCard>
          </DashboardColumn>
        </DashboardRow>
      </DashboardSection>

      <DashboardSection
        title="Executive Intelligence"
        subtitle="Root cause, AI guidance and risk posture for the active incident."
        compact
      >
        <DashboardRow spacing={2}>
          <DashboardColumn xs={12} xl={4}>
            <ExecutiveRCACard
              incidentTitle={incidentTitle}
              executiveRCA={executiveRCA}
              rcaLoading={rcaLoading}
              rcaError={rcaError}
            />
          </DashboardColumn>

          <DashboardColumn xs={12} xl={4}>
            <AICopilot
              incidentTitle={incidentTitle}
              incidentDescription={incidentDescription}
              runbook={runbook}
            />
          </DashboardColumn>

          <DashboardColumn xs={12} xl={4}>
            <IncidentRiskScore
              incidentTitle={incidentTitle}
              incidentDescription={incidentDescription}
              runbook={runbook}
              executiveRCA={
                executiveRCA
                  ? JSON.stringify(executiveRCA, null, 2)
                  : ""
              }
            />
          </DashboardColumn>
        </DashboardRow>
      </DashboardSection>

      <DashboardSection
        title="Operational Intelligence"
        subtitle="Historical similarity, engine status and recent AI activity."
        compact
      >
        <DashboardRow spacing={2}>
          <DashboardColumn xs={12} xl={6}>
            <SimilarIncidentIntelligence
              incidentTitle={incidentTitle}
              loading={similarLoading}
              incidents={similarIncidents}
            />
          </DashboardColumn>

          <DashboardColumn xs={12} md={6} xl={3}>
            <AIEngineStatus />
          </DashboardColumn>

          <DashboardColumn xs={12} md={6} xl={3}>
            <RecentAIActivity
              key={`activity-${refreshKey}`}
            />
          </DashboardColumn>
        </DashboardRow>
      </DashboardSection>

      <DashboardSection
        title="Enterprise Incident Timeline"
        subtitle="Lifecycle events and AI-generated incident milestones."
        compact
      >
        <EnterpriseIncidentTimeline
          key={`incident-timeline-${refreshKey}`}
        />
      </DashboardSection>
    </DashboardContainer>
  );
}

export default Dashboard;