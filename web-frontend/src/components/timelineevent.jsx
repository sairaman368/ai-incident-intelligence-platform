import React, { useState } from "react";

import {
  Box,
  Collapse,
  IconButton,
  Tooltip
} from "@mui/material";

import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PsychologyAltOutlinedIcon from "@mui/icons-material/PsychologyAltOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const stageIcon = (stage) => {
  const value = stage.toLowerCase();

  if (value.includes("incident"))
    return <ReportProblemOutlinedIcon fontSize="small" />;

  if (value.includes("evidence"))
    return <TerminalOutlinedIcon fontSize="small" />;

  if (value.includes("ai"))
    return <SmartToyOutlinedIcon fontSize="small" />;

  if (value.includes("root"))
    return <PsychologyAltOutlinedIcon fontSize="small" />;

  if (value.includes("runbook"))
    return <MenuBookOutlinedIcon fontSize="small" />;

  return <SupervisorAccountOutlinedIcon fontSize="small" />;
};

function getChipClass(status) {
  if (!status) return "pending";

  const s = status.toLowerCase();

  if (s === "completed") return "completed";
  if (s === "active") return "active";
  if (s === "failed") return "failed";

  return "pending";
}

function formatTime(dateValue) {
  if (!dateValue) return "--:--";

  const d = new Date(dateValue);

  if (Number.isNaN(d.getTime())) return "--:--";

  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TimelineEvent({ event, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  const chipClass = getChipClass(event.status);

  return (
    <div className="timeline-row">

      <div className="timeline-time">
        <div className="timeline-time-value">
          {formatTime(event.event_time)}
        </div>

        <div className="timeline-duration">
          Step {index + 1}
        </div>
      </div>

      <div className="timeline-node-wrapper">
        <div className={`timeline-node ${chipClass}`} />
      </div>

      <div className="timeline-content">

        <div className="timeline-top">

          <div className="timeline-stage">

            {stageIcon(event.stage)}

            <div className="timeline-stage-name">
              {event.stage}
            </div>

          </div>

          <Box display="flex" alignItems="center" gap={1}>

            <div className={`timeline-chip ${chipClass}`}>
              {event.status}
            </div>

            <Tooltip title={expanded ? "Collapse" : "Expand"}>

              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{
                  color: "#ffffff"
                }}
              >
                {expanded ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>

            </Tooltip>

          </Box>

        </div>

        <div className="timeline-summary">
          {event.summary}
        </div>

        <Collapse in={expanded} timeout={250}>

          <div className="timeline-details">
            {event.details || "No additional information available."}
          </div>

        </Collapse>

      </div>

    </div>
  );
}