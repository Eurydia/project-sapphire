import { Box, Typography, useTheme } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const theme = useTheme()
  return (
    <Box sx={{ maxWidth: 'lg' }}>
      <Typography>{theme.palette.mode}</Typography>
    </Box>
  )
}
