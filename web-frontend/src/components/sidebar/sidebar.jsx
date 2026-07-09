import {
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardRoundedIcon />,
    path: "/",
  },
  {
    text: "AI Assistant",
    icon: <SmartToyRoundedIcon />,
    path: "/assistant",
  },
  {
    text: "Runbook History",
    icon: <HistoryRoundedIcon />,
    path: "/history",
  },
  {
    text: "Analytics",
    icon: <BarChartRoundedIcon />,
    path: "/analytics",
  },
];

function Sidebar() {
  return (
    <Paper
      elevation={3}
      sx={{
        width: 240,
        minHeight: "75vh",
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2 }}
      >
        Navigation
      </Typography>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&.active": {
                bgcolor: "primary.main",
                color: "white",
              },
              "&.active .MuiListItemIcon-root": {
                color: "white",
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}

export default Sidebar;