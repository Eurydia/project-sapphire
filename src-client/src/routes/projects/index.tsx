import { Link, createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'
import { Alert, Stack, Typography } from '@mui/material'
import type { FC } from 'react'
import { fetchProjectAll } from '@/api/projects'
import { ProjectCard } from '@/components/data-display/project/ProjectCard'

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()
  return (
    <Stack spacing={1}>
      {projects.success &&
        projects.data.map((project, index) => (
          <ProjectCard key={`project-entry[${index}]`} project={project} />
        ))}
      {projects.success && projects.data.length === 0 && (
        <Alert severity="info">
          <Typography>{`No registered project`}</Typography>
          <Link to={'/projects/create'}>{`create one`}</Link>
        </Alert>
      )}
      {!projects.success && (
        <Alert severity="error">
          <Typography>
            {projects.error.issues.map((err) => err.message).join(',')}
          </Typography>
        </Alert>
      )}
    </Stack>
  )
})

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  loader: async () => {
    return { projects: await fetchProjectAll() }
  },
})
