import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectService } from "@/api/project.service"
import { ProjectForm } from "@/components/form/ProjectForm"
import type { ProjectFormData } from "@/types/project-form-data"
import { Paper } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { isRight } from "fp-ts/lib/Either"
import type { FC } from "react"
import { memo, useCallback } from "react"
import { toast } from "react-toastify"

const RouteComponent: FC = memo(() => {
  const { options } = Route.useLoaderData()
  const navigate = Route.useNavigate()

  const handleSubmit = useCallback((data: ProjectFormData) => {
    ProjectService.create(data).then((resp) => {
      if (isRight(resp)) {
        toast.success("project added")
        return navigate({
          to: "/projects/$uuid",
          params: { uuid: resp.right.uuid },
        })
      } else {
        toast.error("failed to add project")
        return
      }
    })
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
        tags: await ProjectTagService.listNames(),
      },
    }
  },
})
