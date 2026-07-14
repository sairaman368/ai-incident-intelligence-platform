import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { exportRunbookPdf } from "../../utils/pdfExport";
import { useSnackbar } from "../../context/SnackbarContext";

function RunbookViewer({
  runbook,
  title = "AI Runbook",
  onClear
}) {
  const { showSnackbar } = useSnackbar();

  const copyRunbook = async () => {
    if (!runbook) {
      return;
    }

    try {
      await navigator.clipboard.writeText(runbook);

      showSnackbar(
        "Runbook copied successfully.",
        "success"
      );
    } catch (error) {
      console.error("Unable to copy runbook:", error);

      showSnackbar(
        "Unable to copy runbook.",
        "error"
      );
    }
  };

  const exportPdf = () => {
    if (!runbook) {
      return;
    }

    try {
      exportRunbookPdf(title, runbook);

      showSnackbar(
        "PDF exported successfully.",
        "success"
      );
    } catch (error) {
      console.error("Unable to export PDF:", error);

      showSnackbar(
        "Unable to export PDF.",
        "error"
      );
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          p: 2,
          "&:last-child": {
            pb: 2
          }
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "background.paper"
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row"
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center"
            }}
            spacing={1.5}
            sx={{
              mb: 1.5
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: "#0f172a"
              }}
            >
              Generated Runbook
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<PictureAsPdfIcon />}
                onClick={exportPdf}
                disabled={!runbook}
                sx={{
                  textTransform: "none",
                  fontWeight: 700
                }}
              >
                Export PDF
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={copyRunbook}
                disabled={!runbook}
                sx={{
                  textTransform: "none",
                  fontWeight: 700
                }}
              >
                Copy
              </Button>

              <Button
                color="error"
                variant="outlined"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={onClear}
                disabled={!runbook}
                sx={{
                  textTransform: "none",
                  fontWeight: 700
                }}
              >
                Clear
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 1.5 }} />
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            lineHeight: 1.8,
            pr: 1,

            "&::-webkit-scrollbar": {
              width: "8px"
            },

            "&::-webkit-scrollbar-track": {
              background: "#f1f5f9",
              borderRadius: "10px"
            },

            "&::-webkit-scrollbar-thumb": {
              background: "#94a3b8",
              borderRadius: "10px"
            },

            "&::-webkit-scrollbar-thumb:hover": {
              background: "#64748b"
            },

            "& h1": {
              fontSize: "2rem",
              marginTop: 2,
              marginBottom: 1.5,
              color: "#0f172a"
            },

            "& h2": {
              fontSize: "1.6rem",
              marginTop: 2,
              marginBottom: 1,
              color: "#0f172a"
            },

            "& h3": {
              fontSize: "1.3rem",
              marginTop: 2,
              marginBottom: 1,
              color: "#0f172a"
            },

            "& p": {
              color: "#334155"
            },

            "& li": {
              color: "#334155"
            },

            "& pre": {
              backgroundColor: "#f4f4f4",
              padding: 2,
              borderRadius: 2,
              overflowX: "auto"
            },

            "& code": {
              fontFamily: "Consolas, monospace"
            },

            "& table": {
              borderCollapse: "collapse",
              width: "100%",
              overflowX: "auto",
              display: "block"
            },

            "& th, & td": {
              border: "1px solid #ddd",
              padding: "8px"
            },

            "& blockquote": {
              marginLeft: 0,
              paddingLeft: 2,
              borderLeft: "4px solid #93c5fd",
              color: "#475569"
            }
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