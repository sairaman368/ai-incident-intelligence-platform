import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { getLatestIncidentTimeline } from "../services/timelineApi";

export default function IncidentTimeline() {
  const [timeline, setTimeline] = useState([]);
  const [incidentTitle, setIncidentTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      const result = await getLatestIncidentTimeline();
      setTimeline(result.data || []);
      setIncidentTitle(result.incident_title || "Latest Incident");
    } catch (error) {
      console.error("Failed to load incident timeline:", error);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: "linear-gradient(135deg, #101828 0%, #1D2939 100%)",
        color: "white",
        boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <TimelineIcon />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Incident Timeline
            </Typography>
            <Typography variant="body2" sx={{ color: "#D0D5DD" }}>
              {incidentTitle}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", mb: 2 }} />

        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress size={28} />
            <Typography variant="body2" mt={2} sx={{ color: "#D0D5DD" }}>
              Loading incident timeline...
            </Typography>
          </Stack>
        ) : timeline.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#D0D5DD" }}>
            No incident timeline available yet. Generate an incident RCA first.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {timeline.map((item, index) => {
              const isCompleted = item.status === "completed";

              return (
                <Box key={`${item.stage}-${index}`}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ pt: 0.5 }}>
                      {isCompleted ? (
                        <CheckCircleIcon sx={{ color: "#12B76A" }} />
                      ) : (
                        <RadioButtonCheckedIcon sx={{ color: "#FEC84B" }} />
                      )}
                    </Box>

                    <Box flex={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <Typography fontWeight={700}>{item.stage}</Typography>

                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            color: "white",
                            backgroundColor: isCompleted
                              ? "rgba(18,183,106,0.25)"
                              : "rgba(254,200,75,0.25)",
                          }}
                        />
                      </Stack>

                      <Typography variant="body2" sx={{ color: "#EAECF0", mt: 0.5 }}>
                        {item.summary}
                      </Typography>

                      <Typography variant="caption" sx={{ color: "#98A2B3" }}>
                        {item.details}
                      </Typography>
                    </Box>
                  </Stack>

                  {index !== timeline.length - 1 && (
                    <Box
                      sx={{
                        width: "2px",
                        height: 26,
                        backgroundColor: "rgba(255,255,255,0.18)",
                        ml: "11px",
                        mt: 1,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}