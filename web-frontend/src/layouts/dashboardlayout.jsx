import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Paper,
  IconButton,
  Stack
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import HistoryIcon from "@mui/icons-material/History";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useThemeMode } from "../context/ThemeContext";

const drawerWidth = 280;

const menuItems = [
  {
    text: "Dashboard",
    path: "/",
    icon: <DashboardIcon />
  },
  {
    text: "AI Assistant",
    path: "/assistant",
    icon: <SmartToyIcon />
  },
  {
    text: "Incident History",
    path: "/history",
    icon: <HistoryIcon />
  },
  {
    text: "Analytics",
    path: "/analytics",
    icon: <AnalyticsIcon />
  }
];

function DashboardLayout({ children }) {
  const location = useLocation();
  const { mode, toggleTheme } = useThemeMode();

  const isDark = mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: isDark ? "#020617" : "#f4f7fb"
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: 1300,
          background: "linear-gradient(90deg, #0f172a, #1e3a8a, #2563eb)",
          borderBottom: "1px solid rgba(255,255,255,0.12)"
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Stack direction="row" spacing={1.3} alignItems="center" sx={{ flexGrow: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: 30 }} />

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
              variant="outlined"
              sx={{
                color: "#ffffff",
                borderColor: "#93c5fd",
                background: "rgba(255,255,255,0.08)",
                fontWeight: 800
              }}
            />
          </Stack>

          <IconButton
            onClick={toggleTheme}
            sx={{
              color: "#ffffff",
              mr: 2,
              border: "1px solid rgba(255,255,255,0.25)"
            }}
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <Chip
            label="Admin"
            sx={{
              color: "#ffffff",
              borderColor: "rgba(255,255,255,0.4)",
              mr: 2,
              fontWeight: 800
            }}
            variant="outlined"
          />

          <Avatar sx={{ bgcolor: "#e5e7eb", color: "#111827", fontWeight: 900 }}>
            A
          </Avatar>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "none",
            background: isDark ? "#0f172a" : "#ffffff",
            color: isDark ? "#f8fafc" : "#0f172a",
            boxShadow: "4px 0 20px rgba(15,23,42,0.18)"
          }
        }}
      >
        <Toolbar sx={{ minHeight: 72 }} />

        <Box sx={{ p: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              background: isDark
                ? "linear-gradient(135deg, #1e293b, #0f172a)"
                : "linear-gradient(135deg, #eff6ff, #eef2ff)",
              border: isDark ? "1px solid #334155" : "1px solid #dbeafe"
            }}
          >
            <Typography variant="subtitle2" sx={{ color: isDark ? "#cbd5e1" : "#475569" }}>
              Workspace
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              IT Operations
            </Typography>
          </Paper>

          <List>
            {menuItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <ListItemButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    mb: 1,
                    borderRadius: 3,
                    py: 1.4,
                    color: active ? "#ffffff" : isDark ? "#cbd5e1" : "#334155",
                    background: active
                      ? "linear-gradient(90deg, #2563eb, #1d4ed8)"
                      : "transparent",
                    "&:hover": {
                      background: active
                        ? "linear-gradient(90deg, #2563eb, #1d4ed8)"
                        : isDark
                        ? "#1e293b"
                        : "#f1f5f9"
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? "#ffffff" : isDark ? "#94a3b8" : "#64748b",
                      minWidth: 42
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: active ? 800 : 600
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" sx={{ color: "#94a3b8", px: 1, fontWeight: 700 }}>
            Portfolio Build v2.0
          </Typography>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: "72px",
          minHeight: "100vh"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;