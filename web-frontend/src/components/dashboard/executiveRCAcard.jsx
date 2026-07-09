import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import SpeedIcon from "@mui/icons-material/Speed";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import TimelineIcon from "@mui/icons-material/Timeline";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import SummarizeIcon from "@mui/icons-material/Summarize";

const getSeverityColor = (severity) => {
  const value = String(severity || "").toLowerCase();

  if (value.includes("critical") || value.includes("high")) return "error";
  if (value.includes("medium") || value.includes("moderate")) return "warning";
  if (value.includes("low")) return "success";

  return "default";
};

const getConfidenceNumber = (confidence) => {
  const match = String(confidence || "").match(/\d+/);
  if (!match) return 0;

  const number = Number(match[0]);
  if (Number.isNaN(number)) return 0;

  return Math.min(Math.max(number, 0), 100);
};

function ExecutiveRCACard({ incidentTitle, executiveRCA, rcaLoading, rcaError }) {
  const confidenceValue = getConfidenceNumber(executiveRCA?.confidence);

  return (
    <Paper
      sx={{
        borderRadius: 4,
        boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        p: 3,
        mt: 3
      }}
    >
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
        <PsychologyAltIcon sx={{ color: "#7c3aed", fontSize: 30 }} />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a" }}>
            Executive RCA Card
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b" }}>
            AI-generated root cause summary for executive review.
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {!incidentTitle && !executiveRCA && (
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Generate a runbook to automatically create executive RCA analysis.
        </Typography>
      )}

      {rcaLoading && (
        <Box display="flex" alignItems="center" gap={2} py={2}>
          <CircularProgress size={24} />

          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Analyzing root cause, severity, confidence, and MTTR...
          </Typography>
        </Box>
      )}

      {rcaError && !rcaLoading && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {rcaError}
        </Alert>
      )}

      {executiveRCA && !rcaLoading && (
        <Stack spacing={2.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  background: "#fef2f2",
                  border: "1px solid #fecaca"
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <CrisisAlertIcon sx={{ color: "#dc2626", fontSize: 30 }} />

                    <Typography sx={{ color: "#64748b", fontWeight: 900 }}>
                      Severity
                    </Typography>
                  </Stack>

                  <Chip
                    label={executiveRCA.severity || "N/A"}
                    color={getSeverityColor(executiveRCA.severity)}
                    sx={{
                      fontWeight: 900,
                      fontSize: 15,
                      px: 1
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0"
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <SpeedIcon sx={{ color: "#16a34a", fontSize: 30 }} />

                    <Typography sx={{ color: "#64748b", fontWeight: 900 }}>
                      Confidence
                    </Typography>
                  </Stack>

                  <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", mb: 1 }}>
                    {executiveRCA.confidence || "N/A"}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={confidenceValue}
                    sx={{
                      height: 8,
                      borderRadius: 10,
                      backgroundColor: "#dcfce7",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 10,
                        backgroundColor: "#16a34a"
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe"
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <TimelineIcon sx={{ color: "#2563eb", fontSize: 30 }} />

                    <Typography sx={{ color: "#64748b", fontWeight: 900 }}>
                      MTTR
                    </Typography>
                  </Stack>

                  <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a" }}>
                    {executiveRCA.mttr || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "#f8fafc",
              border: "1px solid #e2e8f0"
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TroubleshootIcon sx={{ color: "#7c3aed" }} />

                <Typography sx={{ color: "#0f172a", fontWeight: 900 }}>
                  Root Cause Analysis
                </Typography>
              </Stack>

              <Typography sx={{ color: "#334155", lineHeight: 1.7 }}>
                {executiveRCA.rootCause || "N/A"}
              </Typography>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "#ffffff",
              border: "1px solid #e2e8f0"
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <SummarizeIcon sx={{ color: "#2563eb" }} />

                <Typography sx={{ color: "#0f172a", fontWeight: 900 }}>
                  Executive Summary
                </Typography>
              </Stack>

              <Box
                sx={{
                  maxHeight: 170,
                  overflowY: "auto",
                  pr: 1
                }}
              >
                <Typography sx={{ color: "#334155", lineHeight: 1.8 }}>
                  {executiveRCA.executiveSummary || "N/A"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Paper>
  );
}

export default ExecutiveRCACard;