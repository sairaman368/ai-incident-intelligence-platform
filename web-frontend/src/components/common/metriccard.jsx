import { Box, Stack, Typography } from "@mui/material";

export default function MetricCard({
  icon,
  title,
  value,
  subtitle = "",
  color = "#2563eb",
  background = "#eff6ff",
  compact = false
}) {
  return (
    <Box
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 2.5,
        backgroundColor: "#ffffff",
        p: compact ? 1.25 : 1.75,
        height: "100%",
        transition: "all .2s ease",
        "&:hover": {
          boxShadow: "0 6px 18px rgba(15,23,42,.08)",
          transform: "translateY(-2px)"
        }
      }}
    >
      <Stack spacing={1}>
        <Box
          sx={{
            width: compact ? 34 : 40,
            height: compact ? 34 : 40,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            backgroundColor: background,
            color: color
          }}
        >
          {icon}
        </Box>

        <Typography
          variant={compact ? "h6" : "h5"}
          sx={{
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: "#334155"
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              lineHeight: 1.4
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}