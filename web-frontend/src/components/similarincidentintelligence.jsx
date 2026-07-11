import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import TravelExploreIcon from "@mui/icons-material/TravelExplore";

const panelStyle = {
  borderRadius: 4,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  boxShadow: "0 14px 35px rgba(15,23,42,0.08)"
};

function getScoreColor(score) {
  if (score >= 70) {
    return "success";
  }

  if (score >= 45) {
    return "warning";
  }

  return "default";
}

function getProgressColor(score) {
  if (score >= 70) {
    return "#16a34a";
  }

  if (score >= 45) {
    return "#f59e0b";
  }

  return "#64748b";
}

export default function SimilarIncidentIntelligence({
  incidentTitle,
  loading,
  incidents
}) {
  const incidentList = Array.isArray(incidents) ? incidents : [];

  return (
    <Paper sx={{ ...panelStyle, p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <TravelExploreIcon sx={{ color: "#2563eb" }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: "#0f172a"
            }}
          >
            Similar Incident Intelligence
          </Typography>
        </Stack>

        {incidentTitle && (
          <Chip
            label={incidentTitle}
            variant="outlined"
            sx={{
              maxWidth: { xs: "100%", sm: 320 },
              fontWeight: 700
            }}
          />
        )}
      </Stack>

      {!incidentTitle && (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Generate a runbook to search for similar historical incidents.
        </Alert>
      )}

      {incidentTitle && loading && (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={1.5}
          sx={{ py: 4 }}
        >
          <CircularProgress size={30} />

          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Searching historical incident intelligence...
          </Typography>
        </Stack>
      )}

      {incidentTitle && !loading && incidentList.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          No similar incidents were found.
        </Alert>
      )}

      {incidentTitle && !loading && incidentList.length > 0 && (
        <List disablePadding>
          {incidentList.map((item, index) => {
            const score = Number(item.score || 0);
            const normalizedScore = Math.min(
              Math.max(score, 0),
              100
            );

            return (
              <ListItem
                key={item.id || `${item.incident}-${index}`}
                sx={{
                  display: "block",
                  p: 2.25,
                  mb: 1.5,
                  border: "1px solid #e5e7eb",
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                  transition:
                    "transform 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 10px 24px rgba(15,23,42,0.08)"
                  }
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "flex-start",
                    sm: "center"
                  }}
                  spacing={2}
                  sx={{ mb: 1.5 }}
                >
                  <ListItemText
                    primary={
                      item.incident ||
                      item.incident_title ||
                      "Historical Incident"
                    }
                    secondary={
                      item.created_at || "Date unavailable"
                    }
                    primaryTypographyProps={{
                      fontWeight: 900,
                      color: "#0f172a"
                    }}
                    secondaryTypographyProps={{
                      color: "#64748b"
                    }}
                  />

                  <Chip
                    label={`${normalizedScore}% Match`}
                    color={getScoreColor(normalizedScore)}
                    variant="outlined"
                    sx={{ fontWeight: 900 }}
                  />
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={normalizedScore}
                  sx={{
                    height: 8,
                    borderRadius: 10,
                    backgroundColor: "#e5e7eb",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 10,
                      backgroundColor:
                        getProgressColor(normalizedScore)
                    }
                  }}
                />

                {item.root_cause && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#f8fafc"
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        fontWeight: 800,
                        color: "#475569"
                      }}
                    >
                      Root Cause
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.4,
                        color: "#334155"
                      }}
                    >
                      {item.root_cause}
                    </Typography>
                  </Box>
                )}
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
}