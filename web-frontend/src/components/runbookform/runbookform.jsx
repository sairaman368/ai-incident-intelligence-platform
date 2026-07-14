import { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import api from "../../services/api";
import SnackbarMessage from "../Notification/SnackbarMessage";

function RunbookForm({ onRunbookGenerated }) {
  const [incidentTitle, setIncidentTitle] = useState("");
  const [commands, setCommands] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const generateRunbook = async () => {
    const trimmedTitle = incidentTitle.trim();
    const trimmedCommands = commands.trim();

    if (!trimmedTitle || !trimmedCommands) {
      showSnackbar(
        "Please enter the incident title and commands.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/generate-runbook", {
        incident_title: trimmedTitle,
        commands: trimmedCommands
      });

      const incidentId = response?.data?.incident_id;
      const generatedRunbook = response?.data?.runbook || "";

      if (!incidentId) {
        throw new Error(
          "The backend did not return an incident ID."
        );
      }

      if (!generatedRunbook) {
        throw new Error(
          "The backend did not return a generated runbook."
        );
      }

      onRunbookGenerated({
        incidentId,
        incident_id: incidentId,
        runbook: generatedRunbook,
        incidentTitle: trimmedTitle,
        incident_title: trimmedTitle,
        commands: trimmedCommands
      });

      showSnackbar(
        `Runbook generated successfully. Incident ID: ${incidentId}`
      );
    } catch (error) {
      console.error("Runbook generation failed:", error);

      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to generate runbook. Confirm the backend and Ollama are running.";

      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1.25,
            fontWeight: 900,
            color: "#0f172a"
          }}
        >
          AI Runbook Generator
        </Typography>

        <Stack spacing={1.5}>
          <TextField
            label="Incident Title"
            value={incidentTitle}
            onChange={(event) =>
              setIncidentTitle(event.target.value)
            }
            fullWidth
            size="small"
            disabled={loading}
            placeholder="Example: Payment API outage after deployment"
          />

          <TextField
            label="Commands Executed"
            multiline
            minRows={4}
            maxRows={7}
            value={commands}
            onChange={(event) =>
              setCommands(event.target.value)
            }
            fullWidth
            size="small"
            disabled={loading}
            placeholder={
              "kubectl get pods\nkubectl logs payment-api\nkubectl describe pod payment-api"
            }
            sx={{
              "& .MuiInputBase-root": {
                fontFamily: "Consolas, monospace",
                fontSize: "0.84rem",
                lineHeight: 1.45
              }
            }}
          />

          <Button
            variant="contained"
            size="medium"
            disabled={loading}
            onClick={generateRunbook}
            startIcon={
              loading ? (
                <CircularProgress
                  color="inherit"
                  size={17}
                />
              ) : (
                <AutoAwesomeRoundedIcon />
              )
            }
            sx={{
              minHeight: 38,
              borderRadius: 2,
              fontWeight: 800,
              textTransform: "none"
            }}
          >
            {loading
              ? "Generating..."
              : "Generate Runbook"}
          </Button>
        </Stack>
      </Box>

      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((currentSnackbar) => ({
            ...currentSnackbar,
            open: false
          }))
        }
      />
    </>
  );
}

export default RunbookForm;