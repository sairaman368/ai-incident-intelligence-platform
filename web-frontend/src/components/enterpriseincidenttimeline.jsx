import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Box,
  CircularProgress,
  Typography
} from "@mui/material";

import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

import TimelineEvent from "./TimelineEvent";

import { getLatestTimeline } from "../services/timelineApi";

import "../styles/timeline.css";

export default function EnterpriseIncidentTimeline() {
  const [loading, setLoading] = useState(true);
  const [incident, setIncident] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const loadTimeline = async () => {
    try {
      setLoading(true);

      const response = await getLatestTimeline();

      setIncident(response.incident || null);
      setTimeline(response.timeline || []);
    } catch (error) {
      console.error("Timeline Error", error);

      setIncident(null);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();

    const timer = setInterval(loadTimeline, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="timeline-card">

      <CardContent sx={{ p: 4 }}>

        <div className="timeline-header">

          <div className="timeline-title">

            <TimelineOutlinedIcon />

            <div>

              <h2>Enterprise Incident Timeline</h2>

              <p>
                {incident
                  ? incident.title
                  : "No incident selected"}
              </p>

            </div>

          </div>

          <div className="timeline-status">

            {timeline.length} Events

          </div>

        </div>

        {loading ? (

          <div className="timeline-loading">

            <CircularProgress />

            <p>Loading timeline...</p>

          </div>

        ) : timeline.length === 0 ? (

          <div className="timeline-empty">

            <Typography variant="h6">

              No Incident Timeline Available

            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#94a3b8"
              }}
            >
              Generate an incident to begin tracking.

            </Typography>

          </div>

        ) : (

          <Box className="timeline-body">

            <div className="timeline-line" />

            {timeline.map((event, index) => (

              <TimelineEvent
                key={`${event.stage}-${index}`}
                event={event}
                index={index}
              />

            ))}

          </Box>

        )}

      </CardContent>

    </Card>
  );
}