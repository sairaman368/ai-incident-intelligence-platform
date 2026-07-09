import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArticleIcon from "@mui/icons-material/Article";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function RecentAIActivity() {
  const activities = [
    {
      time: "Now",
      title: "AI Platform Ready",
      description: "Dashboard, RCA, analytics, history, and assistant services are available.",
      icon: <AutoAwesomeIcon />,
      status: "Active"
    },
    {
      time: "Recent",
      title: "Runbook Generated",
      description: "Incident intelligence workflow generated operational runbook output.",
      icon: <ArticleIcon />,
      status: "Completed"
    },
    {
      time: "Recent",
      title: "Executive RCA Completed",
      description: "Severity, confidence, MTTR, root cause, and summary were analyzed.",
      icon: <PsychologyAltIcon />,
      status: "Completed"
    },
    {
      time: "Recent",
      title: "Similar Incidents Checked",
      description: "Historical incident patterns were searched for operational similarity.",
      icon: <TravelExploreIcon />,
      status: "Completed"
    },
    {
      time: "Available",
      title: "PDF Export Ready",
      description: "Generated runbooks can be exported for incident records and review.",
      icon: <PictureAsPdfIcon />,
      status: "Ready"
    }
  ];

  return (
    <Paper
      sx={{
        borderRadius: 4,
        boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        p: 3
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a" }}>
            Recent AI Activity
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Live operational activity from the incident intelligence workflow.
          </Typography>
        </Box>

        <Chip
          label="Live"
          color="success"
          variant="outlined"
          sx={{ fontWeight: 900 }}
        />
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1.5}>
        {activities.map((item, index) => (
          <Box
            key={item.title}
            sx={{
              display: "flex",
              gap: 1.5,
              p: 1.6,
              borderRadius: 3,
              background: index === 0 ? "#eff6ff" : "#f8fafc",
              border: index === 0 ? "1px solid #bfdbfe" : "1px solid #e2e8f0"
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 3,
                background: "#ffffff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 8px 18px rgba(15,23,42,0.08)"
              }}
            >
              {item.icon}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>
                  {item.title}
                </Typography>

                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800 }}>
                  {item.time}
                </Typography>
              </Stack>

              <Typography variant="body2" sx={{ color: "#64748b", mt: 0.4 }}>
                {item.description}
              </Typography>

              <Chip
                label={item.status}
                size="small"
                sx={{
                  mt: 1,
                  fontWeight: 800,
                  background: "#ecfdf5",
                  color: "#047857"
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export default RecentAIActivity;