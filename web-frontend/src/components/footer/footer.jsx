import { Typography, Box } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        mt: 3,
      }}
    >
      <Typography color="text.secondary">
        © 2026 AI Runbook Generator
      </Typography>
    </Box>
  );
}

export default Footer;