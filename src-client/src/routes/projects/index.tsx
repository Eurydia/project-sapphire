import { createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'
import { Stack } from '@mui/material'
import type { FC } from 'react'
import { fetchProjectAll } from '@/api/projects'
import { ProjectCard } from '@/components/data-display/project/ProjectCard'

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()
  return (
    <Stack spacing={1}>
      {projects.map((project, index) => (
        <ProjectCard key={`project-entry[${index}]`} project={project} />
      ))}
    </Stack>
  )
})

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  loader: async () => {
    return { projects: await fetchProjectAll() }
  },
})
