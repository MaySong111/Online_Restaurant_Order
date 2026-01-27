import { createTheme } from "@mui/material";

export const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "light" ? "#2e7d32" : "#66bb6a",
      },
      success: {
        main: mode === "light" ? "#4caf50" : "#66bb6a",
      },
      background: {
        default: mode === "light" ? "#f5f5f5" : "#2d2d2d",
        paper: mode === "light" ? "#ffffff" : "#2d2d2d",
      },
      text: {
        primary: mode === "light" ? "#000000" : "#e0e0e0",
        secondary: mode === "light" ? "#666666" : "#999999",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#ffffff" : "#2d2d2d",
            color: mode === "light" ? "#2e7d32" : "#e0e0e0",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: mode === "light" ? "#4caf50" : "#597b5a",
            "&:hover": {
              backgroundColor: mode === "light" ? "#2e7d32" : "#4caf50",
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#4caf50" : "#597b5a",
          },
        },
      },
    },
  });
};
