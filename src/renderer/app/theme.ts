import { alpha, createTheme } from "@mui/material"

export const theme = createTheme({
  typography: { fontFamily: "monospace" },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: { overflowWrap: "break-word" },
      },
    },
    MuiPaper: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        outlined: ({ theme: { spacing } }) => ({
          padding: spacing(2),
        }),
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiInputBase: {
      defaultProps: {
        autoCapitalize: "off",
        autoComplete: "off",
        autoCorrect: "off",
        spellCheck: "false",
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
      },
    },
  },
  palette: {
    mode: "dark",
    text: {
      primary: alpha("#fff", 0.8),
      secondary: alpha("#fff", 0.7),
      disabled: alpha("#fff", 0.6),
    },
  },
})
