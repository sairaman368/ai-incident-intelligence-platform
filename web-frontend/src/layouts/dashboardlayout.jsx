import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import HistoryIcon from "@mui/icons-material/History";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { useThemeMode } from "../context/ThemeContext";

const expandedDrawerWidth = 240;
const collapsedDrawerWidth = 76;
const appBarHeight = 64;

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

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isDark = mode === "dark";

  const drawerWidth = sidebarOpen
    ? expandedDrawerWidth
    : collapsedDrawerWidth;

  const toggleSidebar = () => {
    setSidebarOpen((currentValue) => !currentValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        background: isDark ? "#020617" : "#f4f7fb"
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background:
            "linear-gradient(90deg, #0f172a, #1e3a8a, #2563eb)",
          borderBottom:
            "1px solid rgba(255,255,255,0.12)"
        }}
      >
        <Toolbar
          sx={{
            minHeight: `${appBarHeight}px !important`,
            px: {
              xs: 1.5,
              md: 2
            }
          }}
        >
          <Tooltip
            title={
              sidebarOpen
                ? "Collapse navigation"
                : "Expand navigation"
            }
          >
            <IconButton
              onClick={toggleSidebar}
              sx={{
                mr: 1.25,
                color: "#ffffff",
                border:
                  "1px solid rgba(255,255,255,0.22)",
                "&:hover": {
                  background:
                    "rgba(255,255,255,0.10)"
                }
              }}
            >
              {sidebarOpen ? (
                <MenuOpenRoundedIcon />
              ) : (
                <MenuRoundedIcon />
              )}
            </IconButton>
          </Tooltip>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              flexGrow: 1,
              minWidth: 0
            }}
          >
            <AutoAwesomeIcon
              sx={{
                fontSize: {
                  xs: 24,
                  md: 28
                },
                flexShrink: 0
              }}
            />

            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.03em",
                fontSize: {
                  xs: "1rem",
                  sm: "1.15rem",
                  md: "1.35rem"
                }
              }}
            >
              AI Incident Intelligence Platform
            </Typography>

            <Chip
              label="Enterprise Edition"
              size="small"
              variant="outlined"
              sx={{
                display: {
                  xs: "none",
                  md: "flex"
                },
                color: "#ffffff",
                borderColor: "#93c5fd",
                background:
                  "rgba(255,255,255,0.08)",
                fontWeight: 800
              }}
            />
          </Stack>

          <Tooltip
            title={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: "#ffffff",
                mr: {
                  xs: 0.5,
                  md: 1.5
                },
                border:
                  "1px solid rgba(255,255,255,0.25)"
              }}
            >
              {isDark ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
          </Tooltip>

          <Chip
            label="Admin"
            variant="outlined"
            sx={{
              display: {
                xs: "none",
                sm: "flex"
              },
              color: "#ffffff",
              borderColor:
                "rgba(255,255,255,0.4)",
              mr: 1.5,
              fontWeight: 800
            }}
          />

          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "#e5e7eb",
              color: "#111827",
              fontWeight: 900
            }}
          >
            A
          </Avatar>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          transition:
            "width 220ms ease",

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
            transition:
              "width 220ms ease",
            borderRight: "none",
            background: isDark
              ? "#0f172a"
              : "#ffffff",
            color: isDark
              ? "#f8fafc"
              : "#0f172a",
            boxShadow:
              "4px 0 20px rgba(15,23,42,0.14)"
          }
        }}
      >
        <Toolbar
          sx={{
            minHeight: `${appBarHeight}px !important`
          }}
        />

        <Box
          sx={{
            px: sidebarOpen ? 1.5 : 1,
            py: 1.5
          }}
        >
          {sidebarOpen ? (
            <Paper
              elevation={0}
              sx={{
                p: 1.25,
                mb: 1.5,
                borderRadius: 2.5,
                background: isDark
                  ? "linear-gradient(135deg, #1e293b, #0f172a)"
                  : "linear-gradient(135deg, #eff6ff, #eef2ff)",
                border: isDark
                  ? "1px solid #334155"
                  : "1px solid #dbeafe"
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: isDark
                    ? "#cbd5e1"
                    : "#475569",
                  fontWeight: 700
                }}
              >
                Workspace
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.3
                }}
              >
                IT Operations
              </Typography>
            </Paper>
          ) : (
            <Tooltip
              title="IT Operations Workspace"
              placement="right"
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  mx: "auto",
                  mb: 1.5,
                  borderRadius: 2.5,
                  display: "grid",
                  placeItems: "center",
                  color: "#2563eb",
                  backgroundColor: isDark
                    ? "#1e293b"
                    : "#eff6ff",
                  border: isDark
                    ? "1px solid #334155"
                    : "1px solid #dbeafe",
                  fontWeight: 900
                }}
              >
                IT
              </Box>
            </Tooltip>
          )}

          <List
            sx={{
              p: 0
            }}
          >
            {menuItems.map((item) => {
              const active =
                location.pathname === item.path;

              const navigationButton = (
                <ListItemButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    minHeight: 48,
                    mb: 0.75,
                    px: sidebarOpen ? 1.25 : 0,
                    justifyContent: sidebarOpen
                      ? "flex-start"
                      : "center",
                    borderRadius: 2.5,
                    color: active
                      ? "#ffffff"
                      : isDark
                        ? "#cbd5e1"
                        : "#334155",
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
                      minWidth: sidebarOpen
                        ? 38
                        : 0,
                      mr: sidebarOpen ? 0.5 : 0,
                      justifyContent: "center",
                      color: active
                        ? "#ffffff"
                        : isDark
                          ? "#94a3b8"
                          : "#64748b"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {sidebarOpen && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: active
                          ? 800
                          : 600,
                        fontSize: "0.94rem"
                      }}
                    />
                  )}
                </ListItemButton>
              );

              if (sidebarOpen) {
                return navigationButton;
              }

              return (
                <Tooltip
                  key={item.text}
                  title={item.text}
                  placement="right"
                  arrow
                >
                  {navigationButton}
                </Tooltip>
              );
            })}
          </List>

          <Divider
            sx={{
              my: 1.5
            }}
          />

          {sidebarOpen ? (
            <Typography
              variant="caption"
              sx={{
                color: "#94a3b8",
                px: 1,
                fontWeight: 700
              }}
            >
              Portfolio Build v2.0
            </Typography>
          ) : (
            <Tooltip
              title="Portfolio Build v2.0"
              placement="right"
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontWeight: 800
                }}
              >
                v2
              </Typography>
            </Tooltip>
          )}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          minWidth: 0,
          p: {
            xs: 1,
            sm: 1.5,
            md: 2
          },
          mt: `${appBarHeight}px`,
          minHeight: "100vh",
          overflowX: "hidden",
          transition:
            "width 220ms ease"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;