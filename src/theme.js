import { createMuiTheme } from "@material-ui/core/styles";

const defaults = createMuiTheme();

export default createMuiTheme({
  shape: {
    borderRadius: 0,
  },

  shadows: [...defaults.shadows, `0px 0px 50px 10px rgba(0,0,0,0.3)`],
  palette: {
    type: "dark",
    primary: {
      main: "#3E8DDD",
      contrastText: "#fff",
    },
    secondary: {
      main: "#332E48",
      contrastText: "#fff",
    },
    tertiary: {
      main: "#41E8ED",
      contrastText: "#000000",
    },
    background: {
      paper: "#272337",
      default: "#1e1a2c",
    },
    brandText: {
      main: "#BFBAD3",
    },
    iconColor: {
      main: "#41E8ED",
    },
  },
  typography: {
    fontFamily: ["Abel"].join(","),
  },
  overrides: {
    MuiInputBase: {
      input: {
        padding: "12.5px 15px",
      },
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: "none",
      },
    },
    MuiDialog: {
      paper: {
        borderTop: "2px solid #3E8DDD",
      },
    },
    MuiStepLabel: {
      iconContainer: {
        position: "relative",
      },
    },
    MuiDialogActions: {
      root: {
        background: "#332E48",
        justifyContent: "center",
      },
    },
    MuiListItem: {
      root: {
        width: "90%",
        margin: "auto",
      },
    },
    MuiGrid: {
      item: {
        willChange: "transform",
      },
    },
    MuiTouchRipple: {
      child: {
        backgroundColor: "#3E8DDD",
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: "35px",
      },
    },
    MuiButton: {
      root: {
        fontWeight: "bold",
        lineHeight: "2.0",
      },
      outlinedPrimary: {
        color: "#fff",
      },
    },
    MuiTab: {
      root: {
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiAvatar: {
      colorDefault: {
        border: "dashed #41e8ed5e 2px",
        color: "#41e8ed5e",
        backgroundColor: "transparent",
      },
    },
    MuiTypography: {
      h5: {
        fontWeight: "700",
      },
    },
    MuiSnackbar: {
      root: {
        maxWidth: "700px",
      },
    },
  },
});
