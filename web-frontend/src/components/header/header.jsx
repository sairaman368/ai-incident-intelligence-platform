import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Chip,
  Stack
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg,#0f172a,#1e3a8a,#2563eb)"
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <AutoAwesomeIcon
            sx={{
              fontSize: 28,
              color: "#ffffff"
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.03em"
            }}
          >
            AI Incident Intelligence Platform
          </Typography>

          <Chip
            label="Enterprise Edition"
            size="small"
            sx={{
              ml: 1,
              color: "#ffffff",
              borderColor: "#93c5fd",
              background: "rgba(255,255,255,0.08)",
              fontWeight: 800
            }}
            variant="outlined"
          />
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Typography
          sx={{
            mr: 2,
            color: "#dbeafe",
            fontWeight: 700
          }}
        >
          Welcome, Admin
        </Typography>

        <Avatar
          sx={{
            bgcolor: "#ffffff",
            color: "#1d4ed8",
            fontWeight: 900
          }}
        >
          A
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}

export default Header;