import { Paper } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'
import { toast } from 'react-toastify'
import type { FC } from 'react'
import { ProjectForm } from '@/components/form/ProjectForm'
import { getAllTopic } from '@/db/services/topic.services'
import { getAllTech } from '@/db/services/technology.services'
import { createProject } from '@/db/services/project.services'

const RouteComponent: FC = memo(() => {
  const { options } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  return (
    <Paper variant="outlined">
      <ProjectForm
        action={(dto) =>
          createProject(dto)
            .then(() => navigate({ to: '/projects' }))
            .then(() => toast.success('Project added'))
            .catch(() => toast.error('Failed to add project'))
        }
        options={options}
      />
    </Paper>
  )
})

export const Route = createFileRoute('/projects/create')({
  component: RouteComponent,
  loader: async () => {
    return {
      options: {
        topics: (await getAllTopic()).map(({ name }) => name),
        technologies: (await getAllTech()).map(({ name }) => name),
      },
    }
  },
})
