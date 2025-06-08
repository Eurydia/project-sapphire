import { createTheme, responsiveFontSizes } from '@mui/material'
import { indigo } from '@mui/material/colors'

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: indigo,
    },
    typography: { fontFamily: 'monospace' },
  }),
)
