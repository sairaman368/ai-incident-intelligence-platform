import Chip from "@mui/material/Chip";

const statusStyles = {
  healthy: {
    backgroundColor: "#dcfce7",
    color: "#166534"
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534"
  },
  completed: {
    backgroundColor: "#dcfce7",
    color: "#166534"
  },
  online: {
    backgroundColor: "#dcfce7",
    color: "#166534"
  },
  active: {
    backgroundColor: "#fef3c7",
    color: "#92400e"
  },
  warning: {
    backgroundColor: "#fef3c7",
    color: "#92400e"
  },
  medium: {
    backgroundColor: "#fef3c7",
    color: "#92400e"
  },
  high: {
    backgroundColor: "#ffedd5",
    color: "#9a3412"
  },
  critical: {
    backgroundColor: "#fee2e2",
    color: "#991b1b"
  },
  failed: {
    backgroundColor: "#fee2e2",
    color: "#991b1b"
  },
  offline: {
    backgroundColor: "#fee2e2",
    color: "#991b1b"
  },
  pending: {
    backgroundColor: "#e2e8f0",
    color: "#334155"
  },
  default: {
    backgroundColor: "#e2e8f0",
    color: "#334155"
  }
};

export default function StatusChip({
  label,
  status = "default",
  compact = false,
  icon = null,
  sx = {},
  ...rest
}) {
  const normalizedStatus = String(status || "default").toLowerCase();
  const style =
    statusStyles[normalizedStatus] || statusStyles.default;

  return (
    <Chip
      label={label}
      icon={icon}
      size="small"
      sx={{
        height: compact ? 22 : 26,
        fontSize: compact ? "0.68rem" : "0.74rem",
        fontWeight: 800,
        textTransform: "capitalize",
        backgroundColor: style.backgroundColor,
        color: style.color,
        "& .MuiChip-icon": {
          color: "inherit"
        },
        ...sx
      }}
    />
  );
}