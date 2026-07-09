import { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack
} from "@mui/material";

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
    if (!incidentTitle.trim() || !commands.trim()) {
      showSnackbar("Please fill all fields.", "warning");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/generate-runbook", {
        incident_title: incidentTitle,
        commands
      });

      onRunbookGenerated({
        runbook: response.data.runbook,
        incidentTitle,
        commands
      });

      showSnackbar("Runbook generated successfully.");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to generate runbook.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card elevation={0} sx={{ boxShadow: "none" }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h5" gutterBottom>
            AI Runbook Generator
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Incident Title"
              value={incidentTitle}
              onChange={(e) => setIncidentTitle(e.target.value)}
              fullWidth
            />

            <TextField
              label="Commands Executed"
              multiline
              rows={8}
              value={commands}
              onChange={(e) => setCommands(e.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              disabled={loading}
              onClick={generateRunbook}
            >
              {loading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Generate Runbook"
              )}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false
          })
        }
      />
    </>
  );
}

export default RunbookForm;
