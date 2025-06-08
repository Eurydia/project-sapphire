import { Box, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import type { FC } from 'react'

const RouteComponent: FC = () => {
  return (
    <Box maxWidth="lg">
      <Typography>Hi</Typography>
    </Box>
  )
}

export const Route = createFileRoute('/projects/$projectId/$')({
  component: RouteComponent,
  loader: () => {},
})
