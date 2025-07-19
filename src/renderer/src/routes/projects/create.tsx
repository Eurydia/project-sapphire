import { Paper } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import type { FC } from 'react'
import { memo } from 'react'
import { toast } from 'react-toastify'
import { ProjectForm } from '~/components/form/ProjectForm'
import { createProject } from '~/db/projects'
import { listTech } from '~/db/technologies'
import { listTopic } from '~/db/topics'

const RouteComponent: FC = memo(() => {
  const { options } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  return (
    <Paper variant="outlined">
      <ProjectForm
        action={(dto) =>
          createProject(dto)
            .then(() => navigate({ to: '/projects' }))
            .then(() => toast.success('project added'))
            .catch((err) => {
              console.debug(err)
              toast.error('failed to add project')
            })
        }
        formOptions={options}
      />
    </Paper>
  )
})

export const Route = createFileRoute('/projects/create')({
  component: RouteComponent,
  loader: async () => {
    return {
      options: {
        topics: (await listTopic()).map(({ name }) => name),
        technologies: (await listTech()).map(({ name }) => name)
      }
    }
  }
})
