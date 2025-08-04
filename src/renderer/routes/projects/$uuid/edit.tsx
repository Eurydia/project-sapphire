import { ProjectTagService } from "@/api/project-group.service"
import { ProjectService } from "@/api/project.service"
import { ProjectForm } from "@/components/form/ProjectForm"
import { useLoggerStore } from "@/stores/useLoggerStore"
import type { ProjectFormData } from "@/types/project-form-data"
import { Paper } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import type { FC } from "react"
import { memo, useCallback } from "react"
import { toast } from "react-toastify"

const RouteComponent: FC = memo(() => {
  const { project, formOptions } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { uuid } = Route.useParams()

  const { logNotice, logWarn } = useLoggerStore()
  const handleSubmit = useCallback(
    (data: ProjectFormData) => {
      logNotice(
        `upserting project uuid=${uuid} with ${JSON.stringify(data)}`,
      )
      ProjectService.upsert({ ...data, uuid })
        .then(() => {
          logNotice(`upserted project uuid=${uuid}`)
          toast.success("update saved")
          return navigate({ to: "/projects" })
        })
        .catch((err) => {
          logWarn(
            `failed to upsert project uuid=${uuid}: ${err}`,
          )
          toast.error("update failed")
        })
    },
    [logNotice, logWarn, uuid],
  )

  return (
    <Paper variant="outlined">
      <ProjectForm
        init={{
          description: project.description,
          name: project.name,
          root: project.root.path,
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
    const project = await ProjectService.findByUuid(uuid)
    if (project === null) {
      throw notFound()
    }

    return {
      project,
      formOptions: {
        tags: await ProjectTagService.listNames(),
      },
    }
  },
})
