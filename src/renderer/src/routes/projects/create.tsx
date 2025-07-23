import { Paper } from "@mui/material"
import { createFileRoute, Link } from "@tanstack/react-router"
import type { FC } from "react"
import { memo, useCallback } from "react"
import { toast } from "react-toastify"
import { ProjectForm } from "~/components/form/ProjectForm"
import type { ProjectDto } from "~/db/models/project/dto/project-dto"
import { createProject } from "~/db/projects"
import { listTech } from "~/db/technologies"
import { listTopic } from "~/db/topics"
import { useLoggerStore } from "~/stores/useLoggerStore"

const RouteComponent: FC = memo(() => {
  const { options } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { logNotice, logWarn } = useLoggerStore()

  const handleSubmit = useCallback(
    (dto: ProjectDto) => {
      logNotice(`creating new project: ${JSON.stringify(dto)}`)
      createProject(dto)
        .then((uuid) => {
          logNotice(`project added with uuid=${uuid}`)
          toast.success("project added")
          navigate({ to: "/projects" })
        })
        .catch((err) => {
          logWarn(`unable to add project with error: ${err}`)
          toast.error("failed to add project")
        })
    },
    [logNotice, logWarn],
  )
  return (
    <Paper variant="outlined">
      <Link to="/projects">Back</Link>
      <ProjectForm action={handleSubmit} formOptions={options} />
    </Paper>
  )
})

export const Route = createFileRoute("/projects/create")({
  component: RouteComponent,
  loader: async () => {
    return {
      options: {
        topics: (await listTopic()).map(({ name }) => name),
        technologies: (await listTech()).map(({ name }) => name),
      },
    }
  },
})
