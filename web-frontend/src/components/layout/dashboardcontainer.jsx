import { Box } from "@mui/material";

export default function DashboardContainer({
  children,
  maxWidth = "1920px",
  compact = true,
  sx = {}
}) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth,
        mx: "auto",
        px: {
          xs: compact ? 1 : 2,
          sm: compact ? 1.5 : 2.5,
          lg: compact ? 2 : 3
        },
        pb: compact ? 1 : 2,
        overflowX: "hidden",
        ...sx
      }}
    >
      {children}
    </Box>
  );
}