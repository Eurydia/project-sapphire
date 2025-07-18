import { Stack, TextField } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import type { FC } from 'react'
import { memo } from 'react'
import { listProjects } from '~/db/projects'
import { ProjectList } from '~/components/data-display/project-list/project-list'

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()

  return (
    <Stack spacing={1}>
      <TextField fullWidth size="small" />
      <ProjectList dense items={projects} />
    </Stack>
  )
})

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  loader: async () => {
    return {
      projects: await listProjects()
    }
  }
})
