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
  Stack,
  TextField,
  Typography
} from "@mui/material";

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

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

      const message =
        requestError?.response?.data?.detail ||
        "AI Copilot request failed. Confirm the backend and Ollama are running.";

      setError(message);
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
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        color: "#ffffff",
        boxShadow: "0 18px 42px rgba(15,23,42,0.18)"
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                backgroundColor: "rgba(255,255,255,0.12)"
              }}
            >
              <SmartToyOutlinedIcon />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Executive AI Copilot
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#cbd5e1", mt: 0.3 }}
              >
                Ask questions about the current incident, RCA, and
                recovery actions.
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={hasIncidentContext ? "Incident Context Ready" : "No Context"}
            size="small"
            sx={{
              fontWeight: 800,
              color: hasIncidentContext ? "#bbf7d0" : "#fde68a",
              backgroundColor: hasIncidentContext
                ? "rgba(34,197,94,0.18)"
                : "rgba(245,158,11,0.18)"
            }}
          />
        </Stack>

        <Divider
          sx={{
            my: 2.5,
            borderColor: "rgba(255,255,255,0.12)"
          }}
        />

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{ mb: 2.5 }}
        >
          {suggestedQuestions.map((item) => (
            <Chip
              key={item}
              label={item}
              onClick={() => {
                setQuestion(item);
                submitQuestion(item);
              }}
              disabled={loading}
              sx={{
                color: "#dbeafe",
                border: "1px solid rgba(147,197,253,0.35)",
                backgroundColor: "rgba(37,99,235,0.16)",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(37,99,235,0.28)"
                }
              }}
            />
          ))}
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Example: What is the safest next action for this incident?"
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: 3,
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
          spacing={1.5}
          sx={{ mt: 2 }}
        >
          <Button
            variant="outlined"
            startIcon={<RestartAltRoundedIcon />}
            onClick={clearCopilot}
            disabled={loading}
            sx={{
              color: "#ffffff",
              borderColor: "rgba(255,255,255,0.28)",
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
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SendRoundedIcon />
              )
            }
            onClick={() => submitQuestion()}
            disabled={loading || !question.trim()}
            sx={{
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
              mt: 2.5,
              borderRadius: 3
            }}
          >
            {error}
          </Alert>
        )}

        {answer && (
          <Box
            sx={{
              mt: 2.5,
              p: 2.5,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)"
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 900,
                color: "#bfdbfe",
                mb: 1.2
              }}
            >
              Copilot Response
            </Typography>

            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                color: "#e2e8f0",
                lineHeight: 1.8
              }}
            >
              {answer}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}