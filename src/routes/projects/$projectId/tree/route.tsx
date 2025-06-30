import { Box } from '@mui/material'
import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <Box
      marginX={4}
      marginY={8}
      sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}
    >
      <Outlet />
    </Box>
  )
}

export const Route = createFileRoute('/projects/$projectId/tree')({
  component: RouteComponent,
})
