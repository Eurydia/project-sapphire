import { alpha, createTheme, lighten } from "@mui/material"

declare module "@mui/material/styles" {
  interface Palette {
    link: {
      normal: string
      visited: string
      hover: string
    }
  }

  interface PaletteOptions {
    link?: {
      normal: string
      visited: string
      hover: string
    }
  }
  interface TypographyVariantsOptions {
    monospaceFontFamily: string
    serifFontFamily: string
  }

  interface TypographyVariants {
    monospaceFontFamily: string
    serifFontFamily: string
  }
}

export const theme = createTheme({
  typography: {
    monospaceFontFamily: '"Fira Code"',
    serifFontFamily: '"Fira Code"',
    fontFamily: '"Fira Code"',
  },
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
    link: {
      normal: alpha("#fff", 0.8),
      visited: alpha("#fff", 0.8),
      hover: alpha(lighten("#696969", 0.5), 0.8),
    },
  },
})
