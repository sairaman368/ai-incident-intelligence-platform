import { Box, Stack, Typography } from "@mui/material";

export default function DashboardSection({
  title = "",
  subtitle = "",
  action = null,
  children,
  compact = true,
  sx = {}
}) {
  return (
    <Box
      component="section"
      sx={{
        mt: compact ? 0.8 : 1.5,
        ...sx
      }}
    >
      {(title || subtitle || action) && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{
            mb: compact ? 0.6 : 1
          }}
        >
          <Box>
            {title && (
              <Typography
                variant={compact ? "subtitle1" : "h6"}
                sx={{
                  fontWeight: 900,
                  color: "#0f172a",
                  lineHeight: 1.2
                }}
              >
                {title}
              </Typography>
            )}

            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.25,
                  display: "block",
                  color: "#64748b",
                  lineHeight: 1.4
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {action}
        </Stack>
      )}

      {children}
    </Box>
  );
}