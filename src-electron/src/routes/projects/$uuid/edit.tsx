import { ProjectForm } from '@/components/form/ProjectForm'
import { getProject, updateProject } from '@/db/services/project.services'
import { getAllTech } from '@/db/services/technology.services'
import { getAllTopic } from '@/db/services/topic.services'
import { Paper } from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { memo, type FC } from 'react'
import { toast } from 'react-toastify'

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
          updateProject(uuid, dto)
            .then(() => navigate({ to: '/projects' }))
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
    const project = await getProject(uuid)
    if (project === null) {
      throw notFound()
    }

    return {
      project: project,
      options: {
        topics: (await getAllTopic()).map(({ name }) => name),
        technologies: (await getAllTech()).map(({ name }) => name),
      },
    }
  },
})
