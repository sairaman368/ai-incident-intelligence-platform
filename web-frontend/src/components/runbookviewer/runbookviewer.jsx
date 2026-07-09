import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
  Stack,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { exportRunbookPdf } from "../../utils/pdfExport";
import { useSnackbar } from "../../context/SnackbarContext";

function RunbookViewer({
  runbook,
  title = "AI Runbook",
  onClear,
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

  const exportPdf = () => {
    if (!runbook) return;

    try {
      exportRunbookPdf(title, runbook);

      showSnackbar(
        "PDF exported successfully.",
        "success"
      );
    } catch (err) {
      console.error(err);

      showSnackbar(
        "Unable to export PDF.",
        "error"
      );
    }
  };

  return (
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5">
            Generated Runbook
          </Typography>

          <Stack direction="row" spacing={2}>

            <Button
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              onClick={exportPdf}
              disabled={!runbook}
            >
              Export PDF
            </Button>

            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={copyRunbook}
              disabled={!runbook}
            >
              Copy
            </Button>

            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={onClear}
              disabled={!runbook}
            >
              Clear
            </Button>

          </Stack>

        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            minHeight: 450,
            overflow: "auto",
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
              backgroundColor: "#f4f4f4",
              padding: 2,
              borderRadius: 2,
              overflow: "auto",
            },

            "& code": {
              fontFamily: "Consolas, monospace",
            },

            "& table": {
              borderCollapse: "collapse",
              width: "100%",
            },

            "& th, & td": {
              border: "1px solid #ddd",
              padding: "8px",
            },
          }}
        >
          {runbook ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {runbook}
            </ReactMarkdown>
          ) : (
            <Typography color="text.secondary">
              Generate a runbook to see the AI response.
            </Typography>
          )}
        </Box>

      </CardContent>
    </Card>
  );
}

export default RunbookViewer;