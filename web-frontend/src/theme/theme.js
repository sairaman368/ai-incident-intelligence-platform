import { createTheme } from "@mui/material/styles";

export const getAppTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: "#2563eb"
      },

      secondary: {
        main: "#7c3aed"
      },

      success: {
        main: "#16a34a"
      },

      warning: {
        main: "#f59e0b"
      },

      error: {
        main: "#ef4444"
      },

      background: {
        default: mode === "light" ? "#f4f7fb" : "#020617",
        paper: mode === "light" ? "#ffffff" : "#0f172a"
      },

      text: {
        primary: mode === "light" ? "#0f172a" : "#f8fafc",
        secondary: mode === "light" ? "#64748b" : "#cbd5e1"
      }
    },

    typography: {
      fontFamily: [
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif"
      ].join(","),

      h3: {
        fontWeight: 900
      },

      h4: {
        fontWeight: 800
      },

      h5: {
        fontWeight: 700
      },

      h6: {
        fontWeight: 700
      }
    },

    shape: {
      borderRadius: 12
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none"
          }
        }
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none"
          }
        }
      },

      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none"
          }
        }
      }
    }
  });

export default getAppTheme("light");