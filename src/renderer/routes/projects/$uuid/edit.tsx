import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectService } from "@/api/project.service"
import { ProjectForm } from "@/components/form/ProjectForm"
import type { ProjectFormData } from "@/types/project-form-data"
import { Paper } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import { isLeft } from "fp-ts/lib/Either"
import type { FC } from "react"
import { memo, useCallback } from "react"
import { toast } from "react-toastify"

const RouteComponent: FC = memo(() => {
  const { project, formOptions } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { uuid } = Route.useParams()

  const handleSubmit = useCallback(
    (data: ProjectFormData) => {
      ProjectService.upsert({ ...data, uuid })
        .then(() => {
          return navigate({
            to: "/projects/$uuid",
            params: { uuid: project.uuid },
          })
        })
        .catch(() => {
          toast.error("update failed")
        })
    },
    [uuid],
  )

  return (
    <Paper
      variant="outlined"
      sx={{ maxWidth: "md", marginX: "auto" }}
    >
      <ProjectForm
        init={{
          description: project.description ?? "",
          name: project.name,
          tagNames: project.tags.map(({ name }) => name),
        }}
        action={handleSubmit}
        formOptions={formOptions}
      />
    </Paper>
  )
})

export const Route = createFileRoute("/projects/$uuid/edit")({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    const result = await ProjectService.findByUuid(uuid)
    if (isLeft(result)) {
      throw notFound()
    }

    return {
      project: result.right,
      formOptions: {
        tags: await ProjectTagService.listNames(),
      },
    }
  },
})
