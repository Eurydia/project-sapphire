import { Paper } from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { memo } from 'react'
import { toast } from 'react-toastify'
import type { FC } from 'react'
import type { Project } from '@/models/project/project'
import { ProjectForm } from '@/components/form/ProjectForm'
import { fetchTopicAll } from '@/api/topics'
import { fetchTechnologyAll } from '@/api/technologies'
import { fetchProject, putProject } from '@/api/projects'

const RouteComponent: FC = memo(() => {
  const { project, options } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { uuid } = Route.useParams()

  return (
    <Paper variant="outlined">
      <ProjectForm
        init={{
          description: project.description,
          name: project.name,
          root: project.root,
          technologies: project.technologies.map(({ name }) => name),
          topics: project.topics.map(({ name }) => name),
        }}
        action={(dto) =>
          putProject(uuid, dto)
            .then(() => navigate({ to: '/projects/$uuid', params: { uuid } }))
            .then(() => toast.success('Saved changes'))
            .catch(() => toast.error('Failed to update project'))
        }
        options={options}
      />
    </Paper>
  )
})

export const Route = createFileRoute('/projects/$uuid/edit')({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    if ((await fetchProject(uuid)) === null) {
      throw notFound()
    }

    return {
      project: (await fetchProject(uuid)) as Project,
      options: {
        topics: (await fetchTopicAll()).map(({ name }) => name),
        technologies: (await fetchTechnologyAll()).map(({ name }) => name),
      },
    }
  },
})
