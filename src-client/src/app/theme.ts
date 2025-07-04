import { createTheme } from '@mui/material'

export const theme = createTheme({
  typography: { fontFamily: 'monospace' },
  components: {
    MuiPaper: {
      styleOverrides: {
        outlined: ({ theme: { spacing } }) => ({
          padding: spacing(2),
        }),
      },
    },
  },
  palette: { mode: 'dark' },
})
