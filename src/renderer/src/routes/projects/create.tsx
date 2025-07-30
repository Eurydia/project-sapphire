import { Paper } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import type { FC } from "react"
import { memo, useCallback } from "react"
import { toast } from "react-toastify"
import { ProjectForm } from "~/components/form/ProjectForm"
import type { ProjectDto } from "~/db/models/project/dto/project-dto"
import { ProjectGroupService } from "~/db/project-groups"
import { createProject } from "~/db/projects"
import { listTech } from "~/db/technologies"

const RouteComponent: FC = memo(() => {
  const { options } = Route.useLoaderData()
  const navigate = Route.useNavigate()

  const handleSubmit = useCallback((dto: ProjectDto) => {
    createProject(dto).then(
      () => {
        toast.success("project added")
        navigate({ to: "/projects" })
      },
      (err) => {
        console.debug(err)
        toast.error("failed to add project")
      },
    )
  }, [])
  return (
    <Paper variant="outlined">
      <ProjectForm action={handleSubmit} formOptions={options} />
    </Paper>
  )
})

export const Route = createFileRoute("/projects/create")({
  component: RouteComponent,
  loader: async () => {
    return {
      options: {
        topics: [],
        technologies: (await listTech()).map(({ name }) => name),
        groups: (await ProjectGroupService.list()).map(
          ({ name }) => name,
        ),
      },
    }
  },
})
