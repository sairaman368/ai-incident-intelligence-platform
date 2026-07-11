import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import DashboardCard from "./common/dashboardcard";
import SectionHeader from "./common/sectionheader";
import StatusChip from "./common/statuschip";

import { askCopilot } from "../services/copilotapi";

const suggestedQuestions = [
  "Explain the most probable root cause.",
  "What should the incident commander do next?",
  "What are the operational risks?",
  "Suggest a safe rollback plan."
];

export default function AICopilot({
  incidentTitle = "",
  incidentDescription = "",
  runbook = ""
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasIncidentContext = useMemo(
    () =>
      Boolean(
        incidentTitle.trim() ||
          incidentDescription.trim() ||
          runbook.trim()
      ),
    [incidentTitle, incidentDescription, runbook]
  );

  const submitQuestion = async (selectedQuestion) => {
    const finalQuestion =
      typeof selectedQuestion === "string"
        ? selectedQuestion.trim()
        : question.trim();

    if (!finalQuestion) {
      setError("Enter a question for the AI Copilot.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");

      const response = await askCopilot({
        incident_title:
          incidentTitle.trim() || "Current Incident",
        incident_description: incidentDescription.trim(),
        runbook: runbook.trim(),
        question: finalQuestion
      });

      setAnswer(response?.answer || "No answer was returned.");
      setQuestion(finalQuestion);
    } catch (requestError) {
      console.error("AI Copilot request failed:", requestError);

      setError(
        requestError?.response?.data?.detail ||
          "AI Copilot request failed. Confirm the backend and Ollama are running."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearCopilot = () => {
    setQuestion("");
    setAnswer("");
    setError("");
  };

  return (
    <DashboardCard
      compact
      sx={{
        minHeight: 280,
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        color: "#ffffff",
        borderColor: "rgba(255,255,255,0.08)"
      }}
    >
      <SectionHeader
        compact
        icon={<SmartToyOutlinedIcon fontSize="small" />}
        title="Executive AI Copilot"
        subtitle="Ask questions about the current incident, RCA and recovery actions."
        status={hasIncidentContext ? "Context Ready" : "No Context"}
        statusColor={hasIncidentContext ? "success" : "warning"}
      />

      <Divider
        sx={{
          mb: 1.5,
          borderColor: "rgba(255,255,255,0.12)"
        }}
      />

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={0.75}
        sx={{ mb: 1.5 }}
      >
        {suggestedQuestions.map((item) => (
          <StatusChip
            key={item}
            label={item}
            status="default"
            compact
            sx={{
              color: "#dbeafe",
              border: "1px solid rgba(147,197,253,0.28)",
              backgroundColor: "rgba(37,99,235,0.16)",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(37,99,235,0.26)"
              }
            }}
            onClick={() => {
              setQuestion(item);
              submitQuestion(item);
            }}
          />
        ))}
      </Stack>

      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={4}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Example: What is the safest next action?"
        disabled={loading}
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "#ffffff",
            backgroundColor: "rgba(255,255,255,0.07)",
            borderRadius: 2,
            "& fieldset": {
              borderColor: "rgba(255,255,255,0.18)"
            },
            "&:hover fieldset": {
              borderColor: "rgba(255,255,255,0.32)"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#60a5fa"
            }
          },
          "& textarea::placeholder": {
            color: "#cbd5e1",
            opacity: 1
          }
        }}
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="flex-end"
        spacing={1}
        sx={{ mt: 1.5 }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<RestartAltRoundedIcon />}
          onClick={clearCopilot}
          disabled={loading}
          sx={{
            color: "#ffffff",
            borderColor: "rgba(255,255,255,0.25)",
            textTransform: "none",
            fontWeight: 800,
            "&:hover": {
              borderColor: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.06)"
            }
          }}
        >
          Clear
        </Button>

        <Button
          variant="contained"
          size="small"
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SendRoundedIcon />
            )
          }
          onClick={() => submitQuestion()}
          disabled={loading || !question.trim()}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            backgroundColor: "#2563eb",
            "&:hover": {
              backgroundColor: "#1d4ed8"
            }
          }}
        >
          {loading ? "Analysing..." : "Ask Copilot"}
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 1.5,
            py: 0.25,
            borderRadius: 2
          }}
        >
          {error}
        </Alert>
      )}

      {answer && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            maxHeight: 180,
            overflowY: "auto"
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 900,
              color: "#bfdbfe",
              mb: 0.75
            }}
          >
            Copilot Response
          </Typography>

          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              color: "#e2e8f0",
              lineHeight: 1.55
            }}
          >
            {answer}
          </Typography>
        </Box>
      )}
    </DashboardCard>
  );
}