import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography
} from "@mui/material";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import TodayIcon from "@mui/icons-material/Today";
import StorageIcon from "@mui/icons-material/Storage";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function DashboardStatsCards({ stats, loading }) {
  const cards = [
    {
      title: "Total Runbooks",
      value: stats.total_runbooks,
      trend: "+12% knowledge growth",
      icon: <AssignmentTurnedInIcon />,
      color: "#2563eb",
      bg: "linear-gradient(135deg,#eff6ff,#dbeafe)"
    },
    {
      title: "AI Generated",
      value: stats.ai_generated,
      trend: "Local LLM powered",
      icon: <SmartToyIcon />,
      color: "#16a34a",
      bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)"
    },
    {
      title: "Today's Runbooks",
      value: stats.todays_runbooks,
      trend: "Daily operations activity",
      icon: <TodayIcon />,
      color: "#f59e0b",
      bg: "linear-gradient(135deg,#fffbeb,#fef3c7)"
    },
    {
      title: "Database Status",
      value: stats.database_status,
      trend: "SQLite persistence layer",
      icon: <StorageIcon />,
      color: "#7c3aed",
      bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)"
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 5,
              background: card.bg,
              border: "1px solid rgba(226,232,240,0.9)",
              boxShadow: "0 18px 45px rgba(15,23,42,0.10)",
              transition: "0.25s ease",
              overflow: "hidden",
              position: "relative",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 24px 60px rgba(15,23,42,0.16)"
              }
            }}
          >
            <Box
              sx={{
                position: "absolute",
                right: -28,
                top: -28,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.55)"
              }}
            />

            <CardContent sx={{ position: "relative", zIndex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ color: "#475569", fontWeight: 900 }}>
                    {card.title}
                  </Typography>

                  {loading ? (
                    <CircularProgress size={28} sx={{ mt: 2 }} />
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 950,
                        color: "#0f172a",
                        mt: 1,
                        letterSpacing: "-0.04em"
                      }}
                    >
                      {card.value}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={0.7} alignItems="center" sx={{ mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: card.color }} />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        fontWeight: 800
                      }}
                    >
                      {card.trend}
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.75)",
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.8)"
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardStatsCards;