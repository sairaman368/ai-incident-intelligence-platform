import { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Chip,
  Divider
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SecurityIcon from "@mui/icons-material/Security";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";

import { askAssistant } from "../../services/chatApi";
import { useSnackbar } from "../../context/SnackbarContext";

const panelStyle = {
  borderRadius: 4,
  boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
  border: "1px solid #e5e7eb",
  background: "#ffffff"
};

const suggestions = [
  "Find similar incidents for database outage",
  "Suggest RCA for payment API failure",
  "What commands should I run for high CPU?",
  "Create rollback checklist for failed deployment"
];

function AIAssistant() {
  const { showSnackbar } = useSnackbar();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      const response = await askAssistant(question);
      setAnswer(response);
    } catch (err) {
      console.error(err);
      showSnackbar("Unable to contact AI Assistant.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyAnswer = async () => {
    if (!answer) return;

    await navigator.clipboard.writeText(answer);
    showSnackbar("AI response copied.", "success");
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
            <Stack direction="row" spacing={1} alignItems="center">
              <SmartToyIcon />

              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                AI Incident Assistant
              </Typography>
            </Stack>

            <Typography sx={{ mt: 1, color: "#dbeafe" }}>
              Ask operational questions, generate RCA ideas, and analyze previous runbooks.
            </Typography>
          </Box>

          <Chip
            label="Ollama Powered"
            sx={{ color: "#ffffff", borderColor: "#93c5fd", fontWeight: 700 }}
            variant="outlined"
          />
        </Stack>
      </Paper>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Paper sx={{ ...panelStyle, p: 3, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <PsychologyIcon sx={{ color: "#2563eb" }} />

            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Ask the Assistant
            </Typography>
          </Stack>

          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Ask about incidents, RCA, commands, rollback, prevention..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
            {suggestions.map((item) => (
              <Chip
                key={item}
                label={item}
                onClick={() => setQuestion(item)}
                variant="outlined"
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={askAI}
            disabled={loading}
            sx={{
              fontWeight: 800,
              px: 3,
              py: 1.2,
              borderRadius: 3
            }}
          >
            Ask AI
          </Button>
        </Paper>

        <Paper sx={{ ...panelStyle, p: 3, width: { xs: "100%", md: 360 } }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Assistant Capabilities
          </Typography>

          <Stack spacing={2}>
            <Chip
              icon={<TroubleshootIcon />}
              label="Root Cause Analysis"
              color="primary"
              variant="outlined"
            />

            <Chip
              icon={<SecurityIcon />}
              label="Rollback & Prevention"
              color="success"
              variant="outlined"
            />

            <Chip
              icon={<AutoAwesomeIcon />}
              label="Similar Incident Help"
              color="secondary"
              variant="outlined"
            />

            <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
              Use this assistant to reason over operational incidents and generate practical next steps.
            </Typography>
          </Stack>
        </Paper>
      </Stack>

      {loading && (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      )}

      {answer && !loading && (
        <Paper sx={{ ...panelStyle, mt: 3, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              AI Response
            </Typography>

            <Button startIcon={<ContentCopyIcon />} onClick={copyAnswer}>
              Copy
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Typography sx={{ whiteSpace: "pre-wrap", color: "#0f172a", lineHeight: 1.8 }}>
            {answer}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default AIAssistant;