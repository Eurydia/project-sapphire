import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectTagForm } from "@/components/form/project-tag-form"
import { Paper } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { isRight } from "fp-ts/lib/Either"

export const Route = createFileRoute("/project-tags/create")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  return (
    <Paper variant="outlined">
      <ProjectTagForm
        onSubmit={async (formData) => {
          const result = await ProjectTagService.create(formData)
          if (isRight(result)) {
            await navigate({
              to: "/project-tags/$uuid",
              params: { uuid: result.right },
            })
          }
        }}
      />
    </Paper>
  )
}
