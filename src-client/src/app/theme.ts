import { createTheme } from '@mui/material'

export const theme = createTheme({
  typography: { fontFamily: 'monospace' },
  components: {
    MuiPaper: {
      styleOverrides: {
        outlined: {
          padding: 2,
        },
      },
    },
  },
  palette: { mode: 'dark' },
})
