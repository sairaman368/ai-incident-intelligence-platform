import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";

import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { assessIncidentRisk } from "../services/riskapi";

const riskTheme = {
  Low: {
    color: "#166534",
    background: "#dcfce7",
    progress: "#16a34a"
  },
  Medium: {
    color: "#92400e",
    background: "#fef3c7",
    progress: "#f59e0b"
  },
  High: {
    color: "#9a3412",
    background: "#ffedd5",
    progress: "#ea580c"
  },
  Critical: {
    color: "#991b1b",
    background: "#fee2e2",
    progress: "#dc2626"
  }
};

function getImpactLabel(score) {
  if (score >= 85) return "Critical";
  if (score >= 65) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function ImpactRow({ label, score, inverse = false }) {
  const normalizedScore = Math.min(
    Math.max(Number(score || 0), 0),
    100
  );

  const displayScore = inverse
    ? 100 - normalizedScore
    : normalizedScore;

  const impactLevel = getImpactLabel(displayScore);
  const theme = riskTheme[impactLevel];

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 0.8 }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: "#334155"
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 900,
            color: theme.color
          }}
        >
          {normalizedScore}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={normalizedScore}
        sx={{
          height: 9,
          borderRadius: 10,
          backgroundColor: "#e2e8f0",
          "& .MuiLinearProgress-bar": {
            borderRadius: 10,
            backgroundColor: inverse
              ? "#2563eb"
              : theme.progress
          }
        }}
      />
    </Box>
  );
}

export default function IncidentRiskScore({
  incidentTitle = "",
  incidentDescription = "",
  runbook = "",
  executiveRCA = ""
}) {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasIncidentContext = useMemo(
    () =>
      Boolean(
        incidentTitle.trim() ||
          incidentDescription.trim() ||
          runbook.trim() ||
          executiveRCA.trim()
      ),
    [
      incidentTitle,
      incidentDescription,
      runbook,
      executiveRCA
    ]
  );

  const riskLevel = riskData?.risk_level || "Low";
  const theme = riskTheme[riskLevel] || riskTheme.Low;

  const assessRisk = async () => {
    if (!incidentTitle.trim()) {
      setError(
        "Generate an incident before running the executive risk assessment."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await assessIncidentRisk({
        incident_title: incidentTitle.trim(),
        incident_description:
          incidentDescription.trim(),
        runbook: runbook.trim(),
        executive_rca: executiveRCA.trim()
      });

      setRiskData(response);
    } catch (requestError) {
      console.error(
        "Incident risk assessment failed:",
        requestError
      );

      setRiskData(null);

      setError(
        requestError?.response?.data?.detail ||
          "Risk assessment failed. Confirm the backend and Ollama are running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        background:
          "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow:
          "0 16px 38px rgba(15,23,42,0.09)"
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center"
          }}
          spacing={2}
        >
          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                display: "grid",
                placeItems: "center",
                borderRadius: 3,
                backgroundColor: "#dbeafe",
                color: "#1d4ed8"
              }}
            >
              <SecurityOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: "#0f172a"
                }}
              >
                Executive Incident Risk
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.3,
                  color: "#64748b"
                }}
              >
                AI-generated business and operational risk assessment.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : riskData ? (
                <RefreshRoundedIcon />
              ) : (
                <InsightsOutlinedIcon />
              )
            }
            onClick={assessRisk}
            disabled={loading || !hasIncidentContext}
            sx={{
              fontWeight: 800,
              borderRadius: 3,
              px: 2.5
            }}
          >
            {loading
              ? "Assessing..."
              : riskData
                ? "Reassess Risk"
                : "Assess Risk"}
          </Button>
        </Stack>

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 2.5,
              borderRadius: 3
            }}
          >
            {error}
          </Alert>
        )}

        {!riskData && !error && (
          <Alert
            severity={hasIncidentContext ? "info" : "warning"}
            sx={{
              mt: 2.5,
              borderRadius: 3
            }}
          >
            {hasIncidentContext
              ? "Run the executive risk assessment for the current incident."
              : "Generate an incident to enable risk assessment."}
          </Alert>
        )}

        {riskData && (
          <>
            <Divider sx={{ my: 2.5 }} />

            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                md: "center"
              }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 700
                  }}
                >
                  Overall Risk Score
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    mt: 0.5,
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: 1
                  }}
                >
                  {riskData.overall_score}
                  <Typography
                    component="span"
                    variant="h5"
                    sx={{
                      ml: 0.5,
                      color: "#94a3b8",
                      fontWeight: 800
                    }}
                  >
                    /100
                  </Typography>
                </Typography>
              </Box>

              <Chip
                label={riskLevel}
                sx={{
                  px: 1.5,
                  py: 2.3,
                  fontSize: "0.95rem",
                  fontWeight: 900,
                  backgroundColor: theme.background,
                  color: theme.color
                }}
              />
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Stack spacing={2.2}>
                <ImpactRow
                  label="Customer Impact"
                  score={riskData.customer_impact}
                />

                <ImpactRow
                  label="Availability Impact"
                  score={riskData.availability_impact}
                />

                <ImpactRow
                  label="Financial Impact"
                  score={riskData.financial_impact}
                />

                <ImpactRow
                  label="Operational Impact"
                  score={riskData.operational_impact}
                />

                <ImpactRow
                  label="Recovery Confidence"
                  score={riskData.recovery_confidence}
                  inverse
                />
              </Stack>
            </Box>

            <Box
              sx={{
                mt: 3,
                p: 2.3,
                borderRadius: 3,
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0"
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 900,
                  color: "#334155",
                  mb: 0.8
                }}
              >
                Executive Summary
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#475569",
                  lineHeight: 1.7
                }}
              >
                {riskData.summary}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}