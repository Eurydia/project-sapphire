import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectTagForm } from "@/components/form/project-tag-form"
import { useLoggerStore } from "@/stores/useLoggerStore"
import {
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import { isLeft } from "fp-ts/lib/Either"
import { memo, type FC } from "react"

const RouteComponent: FC = memo(() => {
  const { tag } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { logNotice, logWarn } = useLoggerStore()
  return (
    <Paper
      variant="outlined"
      sx={{ maxWidth: "md", marginX: "auto" }}
    >
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography>UUID</Typography>
          <TextField
            disabled
            defaultValue={tag.uuid}
            fullWidth
          />
        </Stack>
        <ProjectTagForm
          init={tag}
          onSubmit={async (formData) => {
            const response = await ProjectTagService.update({
              ...formData,
              uuid: tag.uuid,
            })
            if (isLeft(response)) {
              logWarn(
                `failed to update ${tag.uuid} with error: ${response.left}`,
              )
            } else {
              logNotice(`update success ${response.right}`)
              logNotice(`navigating back to tag homepage`)
              navigate({
                to: "/project-tags/$uuid",
                params: { uuid: tag.uuid },
              })
            }
          }}
        />
      </Stack>
    </Paper>
  )
})

export const Route = createFileRoute("/project-tags/$uuid/edit")(
  {
    component: RouteComponent,
    loader: async ({ params: { uuid } }) => {
      const tag = await ProjectTagService.findByUUID(uuid)
      if (tag === null) {
        throw notFound()
      }
      return { tag }
    },
  },
)
