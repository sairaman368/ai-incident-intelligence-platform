import React, { useState } from "react";

import {
    Box,
    Collapse,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    Divider
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PsychologyAltOutlinedIcon from "@mui/icons-material/PsychologyAltOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

import TimelineStatusBadge from "./TimelineStatusBadge";

const ICONS = {
    report_problem: ReportProblemOutlinedIcon,
    terminal: TerminalOutlinedIcon,
    smart_toy: SmartToyOutlinedIcon,
    psychology: PsychologyAltOutlinedIcon,
    menu_book: MenuBookOutlinedIcon,
    supervisor_account: SupervisorAccountOutlinedIcon
};

export default function TimelineEvent({ event }) {

    const [expanded, setExpanded] = useState(false);

    const Icon =
        ICONS[event.icon] ||
        SupervisorAccountOutlinedIcon;

    return (

        <div className="timeline-row">

            <div className="timeline-time">

                <div className="timeline-time-value">

                    {event.timestamp}

                </div>

                <div className="timeline-duration">

                    {event.duration}

                </div>

            </div>

            <div className="timeline-node-wrapper">

                <div className={`timeline-node ${event.status}`} />

            </div>

            <div className="timeline-content">

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >

                        <Icon
                            sx={{
                                color: "#60A5FA"
                            }}
                        />

                        <Typography
                            className="timeline-stage-name"
                        >
                            {event.stage}
                        </Typography>

                    </Stack>

                    <Stack
                        direction="row"
                        alignItems="center"
                    >

                        <TimelineStatusBadge
                            status={event.status}
                            severity={event.severity}
                            confidence={event.confidence}
                        />

                        <Tooltip
                            title={
                                expanded
                                    ? "Collapse"
                                    : "Expand"
                            }
                        >

                            <IconButton
                                sx={{
                                    ml: 1,
                                    color: "#fff"
                                }}
                                onClick={() =>
                                    setExpanded(!expanded)
                                }
                            >

                                {expanded
                                    ? <ExpandLessIcon />
                                    : <ExpandMoreIcon />}

                            </IconButton>

                        </Tooltip>

                    </Stack>

                </Stack>

                <Typography
                    className="timeline-summary"
                >

                    {event.summary}

                </Typography>

                <Collapse
                    in={expanded}
                >

                    <Divider
                        sx={{
                            my: 2,
                            borderColor:
                                "rgba(255,255,255,.08)"
                        }}
                    />

                    <Box
                        className="timeline-details"
                    >

                        <Typography
                            fontWeight={700}
                            mb={1}
                        >
                            Details
                        </Typography>

                        <Typography
                            sx={{
                                whiteSpace: "pre-wrap"
                            }}
                        >
                            {event.details}
                        </Typography>

                        <Divider
                            sx={{
                                my: 2,
                                borderColor:
                                    "rgba(255,255,255,.08)"
                            }}
                        />

                        <Typography
                            fontWeight={700}
                            mb={1}
                        >
                            Metadata
                        </Typography>

                        <Typography>

                            Engine :
                            {" "}
                            {event.metadata.engine}

                        </Typography>

                        <Typography>

                            Model :
                            {" "}
                            {event.metadata.model}

                        </Typography>

                        <Typography>

                            Source :
                            {" "}
                            {event.metadata.source}

                        </Typography>

                    </Box>

                </Collapse>

            </div>

        </div>

    );

}