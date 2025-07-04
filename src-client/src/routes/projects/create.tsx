import { Paper } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'
import type { CreateProjectDto } from '@/models/project/dto/create-project'
import type { FC } from 'react'
import { ProjectForm } from '@/components/form/ProjectForm'
import { fetchTopicAll } from '@/api/topics'
import { fetchTechnologyAll } from '@/api/technologies'
import { postProject } from '@/api/projects'

const RouteComponent: FC = memo(() => {
  const { options } = Route.useLoaderData()
  return (
    <Paper variant="outlined">
      <ProjectForm action={postProject} options={options} />
    </Paper>
  )
})

export const Route = createFileRoute('/projects/create')({
  component: RouteComponent,
  loader: async () => {
    return {
      options: {
        topics: (await fetchTopicAll()).map(({ name }) => name),
        technologies: (await fetchTechnologyAll()).map(({ name }) => name),
      },
    }
  },
})
