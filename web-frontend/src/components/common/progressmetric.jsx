import { Box, LinearProgress, Stack, Typography } from "@mui/material";

const toneMap = {
  success: "#16a34a",
  warning: "#f59e0b",
  error: "#dc2626",
  info: "#2563eb",
  default: "#64748b"
};

export default function ProgressMetric({
  label,
  value,
  suffix = "%",
  tone = "default",
  helperText = "",
  inverse = false,
  compact = false
}) {
  const normalizedValue = Math.min(
    Math.max(Number(value || 0), 0),
    100
  );

  const progressValue = inverse
    ? 100 - normalizedValue
    : normalizedValue;

  const progressColor = toneMap[tone] || toneMap.default;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ mb: compact ? 0.5 : 0.75 }}
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
            color: progressColor
          }}
        >
          {normalizedValue}
          {suffix}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{
          height: compact ? 7 : 9,
          borderRadius: 999,
          backgroundColor: "#e2e8f0",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            backgroundColor: progressColor
          }
        }}
      />

      {helperText && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: "block",
            color: "#64748b",
            lineHeight: 1.35
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}