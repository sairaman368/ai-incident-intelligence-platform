import { createContext, useContext, useState } from "react";

import {
  Snackbar,
  Alert,
} from "@mui/material";

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message,
    severity = "success"
  ) => {

    setSnackbar({
      open: true,
      message,
      severity,
    });

  };

  const handleClose = () => {

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));

  };

  return (

    <SnackbarContext.Provider
      value={{ showSnackbar }}
    >

      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >

        <Alert
          severity={snackbar.severity}
          onClose={handleClose}
          variant="filled"
          sx={{ width: "100%" }}
        >

          {snackbar.message}

        </Alert>

      </Snackbar>

    </SnackbarContext.Provider>

  );

}

export function useSnackbar() {
  return useContext(SnackbarContext);
}