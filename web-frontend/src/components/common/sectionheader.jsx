import {
  Box,
  Chip,
  Stack,
  Typography
} from "@mui/material";

export default function SectionHeader({
  icon,
  title,
  subtitle = "",
  status = "",
  statusColor = "default",
  action = null,
  compact = false
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={1}
      sx={{ mb: compact ? 1.25 : 1.75 }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {icon && (
          <Box
            sx={{
              width: compact ? 32 : 36,
              height: compact ? 32 : 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              flexShrink: 0
            }}
          >
            {icon}
          </Box>
        )}

        <Box>
          <Typography
            variant={compact ? "subtitle2" : "subtitle1"}
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                mt: 0.2,
                display: "block",
                color: "#64748b",
                lineHeight: 1.4
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        {status && (
          <Chip
            label={status}
            size="small"
            color={statusColor}
            sx={{
              height: 24,
              fontWeight: 800
            }}
          />
        )}

        {action}
      </Stack>
    </Stack>
  );
}