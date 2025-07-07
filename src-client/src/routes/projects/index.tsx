import { createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'
import { Box, Stack, TextField, Toolbar } from '@mui/material'
import type { FC } from 'react'
import { fetchProjectAll } from '@/api/projects'
import { ProjectList } from '@/components/data-display/project-list/project-list'

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()

  return (
    <Box padding={2} maxWidth="lg" marginX="auto">
      <Stack spacing={2}>
        <Toolbar disableGutters>
          <TextField fullWidth size="small" />
        </Toolbar>
        <ProjectList dense fetcher={projects} />
      </Stack>
    </Box>
  )
})

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  loader: () => {
    return { projects: fetchProjectAll() }
  },
})
