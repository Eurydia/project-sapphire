import { Paper } from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'
import type { FC } from 'react'
import { memo } from 'react'
import { toast } from 'react-toastify'
import { getProjectByUuid, updateProject } from '~/db/projects'
import { listTech } from '~/db/technologies'
import { listTopic } from '~/db/topics'
import { ProjectForm } from '~/components/form/ProjectForm'

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
          topics: project.topics.map(({ name }) => name)
        }}
        action={(dto) =>
          updateProject(uuid, dto)
            .then(() => navigate({ to: '/projects' }))
            .then(() => toast.success('update saved'))
            .catch(() => toast.error('update failed'))
        }
        options={options}
      />
    </Paper>
  )
})

export const Route = createFileRoute('/projects/$uuid/edit')({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    const project = await getProjectByUuid(uuid)

    if (project === null) {
      throw notFound()
    }

    return {
      project,
      options: {
        topics: (await listTopic()).map(({ name }) => name),
        technologies: (await listTech()).map(({ name }) => name)
      }
    }
  }
})
