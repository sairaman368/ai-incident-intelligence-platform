import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { getRunbooks } from "../../services/historyApi";
import { searchRunbooks } from "../../services/searchApi";
import RunbookDialog from "../RunbookDialog/RunbookDialog";

const panelStyle = {
  borderRadius: 4,
  boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
  border: "1px solid #e5e7eb",
  background: "#ffffff"
};

function RunbookHistory({ onSelect }) {
  const [runbooks, setRunbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRunbook, setSelectedRunbook] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadRunbooks = async () => {
    try {
      setLoading(true);
      const data = await getRunbooks();
      setRunbooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query) => {
    try {
      setLoading(true);

      if (!query.trim()) {
        await loadRunbooks();
        return;
      }

      const data = await searchRunbooks(query);
      setRunbooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRunbooks();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const openRunbook = (item) => {
    setSelectedRunbook(item);
    setDialogOpen(true);

    if (onSelect) {
      onSelect(item.runbook);
    }
  };

  return (
    <>
      <Paper
        sx={{
          ...panelStyle,
          p: 4,
          mb: 3,
          background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
          color: "#ffffff"
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <HistoryIcon />

              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                Runbook History
              </Typography>
            </Stack>

            <Typography sx={{ mt: 1, color: "#dbeafe" }}>
              Search, review, and manage previously generated incident runbooks.
            </Typography>
          </Box>

          <Chip
            label={`${runbooks.length} Records`}
            sx={{ color: "#ffffff", borderColor: "#93c5fd", fontWeight: 700 }}
            variant="outlined"
          />
        </Stack>
      </Paper>

      <Paper sx={{ ...panelStyle, p: 3 }}>
        <TextField
          fullWidth
          label="Search incident title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 800 }}>Incident</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Commands</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {runbooks.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => openRunbook(item)}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>
                      {item.incident_title}
                    </TableCell>

                    <TableCell
                      sx={{
                        maxWidth: 260,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#64748b"
                      }}
                    >
                      {item.commands}
                    </TableCell>

                    <TableCell>
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label="Completed"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={<VisibilityIcon />}
                        label="View"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {runbooks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        No runbooks found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <RunbookDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={selectedRunbook?.incident_title}
        runbook={selectedRunbook?.runbook}
        runbookId={selectedRunbook?.id}
        onDeleted={loadRunbooks}
      />
    </>
  );
}

export default RunbookHistory;