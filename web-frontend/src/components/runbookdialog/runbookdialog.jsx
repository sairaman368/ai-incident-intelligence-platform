import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteRunbook } from "../../services/historyApi";
import { useSnackbar } from "../../context/SnackbarContext";

function RunbookDialog({
  open,
  onClose,
  runbook,
  title,
  runbookId,
  onDeleted,
}) {
  const { showSnackbar } = useSnackbar();

  const copyRunbook = async () => {
    if (!runbook) return;

    try {
      await navigator.clipboard.writeText(runbook);

      showSnackbar(
        "Runbook copied successfully.",
        "success"
      );
    } catch (err) {
      console.error(err);

      showSnackbar(
        "Unable to copy runbook.",
        "error"
      );
    }
  };

  const handleDelete = async () => {
    if (!runbookId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this runbook?"
    );

    if (!confirmed) return;

    try {
      await deleteRunbook(runbookId);

      showSnackbar(
        "Runbook deleted successfully.",
        "success"
      );

      if (onDeleted) {
        await onDeleted();
      }

      onClose();
    } catch (err) {
      console.error(err);

      showSnackbar(
        "Unable to delete runbook.",
        "error"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {title}
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            lineHeight: 1.8,

            "& h1": {
              fontSize: "2rem",
              mt: 2,
            },

            "& h2": {
              fontSize: "1.6rem",
              mt: 2,
            },

            "& h3": {
              fontSize: "1.3rem",
              mt: 2,
            },

            "& pre": {
              background: "#f4f4f4",
              padding: 2,
              borderRadius: 2,
              overflow: "auto",
            },

            "& code": {
              fontFamily: "Consolas, monospace",
            },

            "& table": {
              width: "100%",
              borderCollapse: "collapse",
            },

            "& th, & td": {
              border: "1px solid #ddd",
              padding: "8px",
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {runbook}
          </ReactMarkdown>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          startIcon={<ContentCopyIcon />}
          onClick={copyRunbook}
        >
          Copy
        </Button>

        <Button
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Delete
        </Button>

        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RunbookDialog;