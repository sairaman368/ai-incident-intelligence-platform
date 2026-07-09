import {
  Box,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import MemoryIcon from "@mui/icons-material/Memory";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SpeedIcon from "@mui/icons-material/Speed";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";

function AIEngineStatus() {
  const items = [
    {
      label: "Model",
      value: "Qwen2.5:3B",
      icon: <MemoryIcon />,
      color: "#7c3aed"
    },
    {
      label: "Runtime",
      value: "Ollama Local",
      icon: <SmartToyIcon />,
      color: "#2563eb"
    },
    {
      label: "Avg Inference",
      value: "38–85 sec",
      icon: <SpeedIcon />,
      color: "#f59e0b"
    },
    {
      label: "AI Confidence",
      value: "95%",
      icon: <PsychologyAltIcon />,
      color: "#16a34a"
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
            AI Engine Status
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Local LLM runtime and inference health.
          </Typography>
        </Box>

        <Chip
          label="Online"
          color="success"
          variant="outlined"
          sx={{ fontWeight: 900 }}
        />
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1.5}>
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{
              p: 1.6,
              borderRadius: 3,
              background: "#f8fafc",
              border: "1px solid #e2e8f0"
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 3,
                    background: `${item.color}18`,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {item.icon}
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 900 }}>
                    {item.label}
                  </Typography>

                  <Typography sx={{ color: "#0f172a", fontWeight: 900 }}>
                    {item.value}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.7 }}>
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 900 }}>
            Engine Readiness
          </Typography>

          <Typography variant="body2" sx={{ color: "#16a34a", fontWeight: 900 }}>
            96%
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={96}
          sx={{
            height: 9,
            borderRadius: 10,
            backgroundColor: "#dcfce7",
            "& .MuiLinearProgress-bar": {
              borderRadius: 10,
              backgroundColor: "#16a34a"
            }
          }}
        />
      </Box>
    </Paper>
  );
}

export default AIEngineStatus;