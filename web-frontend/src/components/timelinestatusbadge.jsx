import React from "react";
import Chip from "@mui/material/Chip";

const STATUS_COLORS = {
    completed: {
        background: "#DCFCE7",
        color: "#166534"
    },
    active: {
        background: "#FEF3C7",
        color: "#92400E"
    },
    failed: {
        background: "#FEE2E2",
        color: "#991B1B"
    },
    pending: {
        background: "#E5E7EB",
        color: "#374151"
    }
};

const SEVERITY_COLORS = {
    critical: {
        background: "#7F1D1D",
        color: "#FCA5A5"
    },
    high: {
        background: "#9A3412",
        color: "#FDBA74"
    },
    medium: {
        background: "#78350F",
        color: "#FCD34D"
    },
    low: {
        background: "#064E3B",
        color: "#6EE7B7"
    }
};

export default function TimelineStatusBadge({
    status,
    severity,
    confidence
}) {

    const statusStyle =
        STATUS_COLORS[(status || "").toLowerCase()] ||
        STATUS_COLORS.pending;

    const severityStyle =
        SEVERITY_COLORS[(severity || "").toLowerCase()] ||
        SEVERITY_COLORS.medium;

    return (
        <>
            <Chip
                label={status}
                size="small"
                sx={{
                    fontWeight: 700,
                    textTransform: "capitalize",
                    background: statusStyle.background,
                    color: statusStyle.color
                }}
            />

            <Chip
                label={severity}
                size="small"
                sx={{
                    fontWeight: 700,
                    ml: 1,
                    textTransform: "capitalize",
                    background: severityStyle.background,
                    color: severityStyle.color
                }}
            />

            <Chip
                label={`${confidence}%`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                    ml: 1,
                    fontWeight: 700
                }}
            />
        </>
    );
}