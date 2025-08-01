import { ProjectGroupService } from "@/api/project-group.service"
import { ProjectTechnologyService } from "@/api/project-technology.service"
import { ProjectTopicService } from "@/api/project-topic.service"
import { ProjectService } from "@/api/project.service"
import { ProjectForm } from "@/components/form/ProjectForm"
import type { ProjectFormData } from "@/types/project-form-data"
import { Paper } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import type { FC } from "react"
import { memo, useCallback } from "react"
import { toast } from "react-toastify"

const RouteComponent: FC = memo(() => {
  const { options } = Route.useLoaderData()
  const navigate = Route.useNavigate()

  const handleSubmit = useCallback((data: ProjectFormData) => {
    ProjectService.create(data).then(
      () => {
        toast.success("project added")
        return navigate({ to: "/projects" })
      },
      () => {
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
        topics: await ProjectTopicService.listNames(),
        technologies: await ProjectTechnologyService.listNames(),
        groups: await ProjectGroupService.listNames(),
      },
    }
  },
})
