import { Box, Paper } from "@mui/material";

export default function DashboardCard({
  children,
  sx = {},
  compact = false,
  scrollable = false
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        boxShadow: "0 8px 22px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
        ...sx
      }}
    >
      <Box
        sx={{
          height: "100%",
          p: compact ? 1.35 : 1.6,
          overflowY: scrollable ? "auto" : "visible"
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
