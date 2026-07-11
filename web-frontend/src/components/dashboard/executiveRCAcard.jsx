import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography
} from "@mui/material";

import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import SpeedIcon from "@mui/icons-material/Speed";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import TimelineIcon from "@mui/icons-material/Timeline";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import SummarizeIcon from "@mui/icons-material/Summarize";

import DashboardCard from "../common/dashboardcard";
import SectionHeader from "../common/sectionheader";
import MetricCard from "../common/metriccard";
import ProgressMetric from "../common/progressmetric";
import StatusChip from "../common/statuschip";

const getSeverityStatus = (severity) => {
  const value = String(severity || "").toLowerCase();

  if (value.includes("critical")) return "critical";
  if (value.includes("high")) return "high";
  if (value.includes("medium") || value.includes("moderate")) {
    return "medium";
  }
  if (value.includes("low")) return "success";

  return "default";
};

const getConfidenceNumber = (confidence) => {
  const match = String(confidence || "").match(/\d+/);

  if (!match) {
    return 0;
  }

  const value = Number(match[0]);

  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 100);
};

function ExecutiveRCACard({
  incidentTitle,
  executiveRCA,
  rcaLoading,
  rcaError
}) {
  const confidenceValue = getConfidenceNumber(
    executiveRCA?.confidence
  );

  return (
    <DashboardCard
      compact
      sx={{
        mt: 2,
        minHeight: 280
      }}
    >
      <SectionHeader
        compact
        icon={<PsychologyAltIcon fontSize="small" />}
        title="Executive RCA"
        subtitle="AI-generated root cause summary for leadership review."
        status={executiveRCA ? "Ready" : ""}
        statusColor={executiveRCA ? "success" : "default"}
      />

      <Divider sx={{ mb: 1.5 }} />

      {!incidentTitle && !executiveRCA && !rcaLoading && (
        <Alert
          severity="info"
          sx={{
            py: 0.25,
            borderRadius: 2
          }}
        >
          Generate a runbook to create the executive RCA.
        </Alert>
      )}

      {rcaLoading && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ py: 2 }}
        >
          <CircularProgress size={22} />

          <Typography
            variant="body2"
            sx={{ color: "#64748b" }}
          >
            Analysing severity, confidence, root cause and MTTR...
          </Typography>
        </Stack>
      )}

      {rcaError && !rcaLoading && (
        <Alert
          severity="error"
          sx={{
            py: 0.25,
            borderRadius: 2
          }}
        >
          {rcaError}
        </Alert>
      )}

      {executiveRCA && !rcaLoading && (
        <Stack spacing={1.5}>
          <Grid container spacing={1.25}>
            <Grid item xs={12} sm={4}>
              <MetricCard
                compact
                icon={<CrisisAlertIcon fontSize="small" />}
                title="Severity"
                value={
                  <StatusChip
                    label={executiveRCA.severity || "N/A"}
                    status={getSeverityStatus(
                      executiveRCA.severity
                    )}
                    compact
                  />
                }
                color="#dc2626"
                background="#fef2f2"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <MetricCard
                compact
                icon={<SpeedIcon fontSize="small" />}
                title="Confidence"
                value={executiveRCA.confidence || "N/A"}
                color="#16a34a"
                background="#f0fdf4"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <MetricCard
                compact
                icon={<TimelineIcon fontSize="small" />}
                title="MTTR"
                value={executiveRCA.mttr || "N/A"}
                color="#2563eb"
                background="#eff6ff"
              />
            </Grid>
          </Grid>

          <ProgressMetric
            compact
            label="AI Confidence"
            value={confidenceValue}
            tone="success"
          />

          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc"
            }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ mb: 0.75 }}
            >
              <TroubleshootIcon
                fontSize="small"
                sx={{ color: "#7c3aed" }}
              />

              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 900,
                  color: "#0f172a"
                }}
              >
                Root Cause
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: "#334155",
                lineHeight: 1.55,
                maxHeight: 110,
                overflowY: "auto",
                pr: 0.5
              }}
            >
              {executiveRCA.rootCause || "N/A"}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff"
            }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ mb: 0.75 }}
            >
              <SummarizeIcon
                fontSize="small"
                sx={{ color: "#2563eb" }}
              />

              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 900,
                  color: "#0f172a"
                }}
              >
                Executive Summary
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: "#334155",
                lineHeight: 1.55,
                maxHeight: 110,
                overflowY: "auto",
                pr: 0.5
              }}
            >
              {executiveRCA.executiveSummary || "N/A"}
            </Typography>
          </Box>
        </Stack>
      )}
    </DashboardCard>
  );
}

export default ExecutiveRCACard;