import { updateProjectTagDtoSchema } from "#/models/project-tag/dto/update-project-tag.dto"
import { ProjectTagService } from "@/api/project-tag.service"
import { TypographyButton } from "@/components/input/typography-button"
import { useLoggerStore } from "@/stores/useLoggerStore"
import {
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useForm } from "@tanstack/react-form"
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
  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      name: tag.name,
      description: tag.description,
    },
    validators: {
      onChangeAsync: updateProjectTagDtoSchema.pick({
        name: true,
        description: true,
      }),
    },
    onSubmit: async ({ value }) => {
      const response = await ProjectTagService.update({
        ...value,
        uuid: tag.uuid,
      })
      if (isLeft(response)) {
        logWarn(
          `failed to update ${tag} with error: ${response.left}`,
        )
      } else {
        logNotice(`update success ${response.right}`)
        logNotice(`navigating back to tag homepage`)
        navigate({
          to: "/project-tags/$uuid",
          params: { uuid: tag.uuid },
        })
      }
    },
  })
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
        <Stack spacing={0.5}>
          <Typography>NAME</Typography>
          <Field name="name">
            {({
              state: {
                value,
                meta: { errors, isPristine },
              },
              handleChange,
              handleBlur,
            }) => (
              <TextField
                value={value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
                error={errors.length > 0 && !isPristine}
              />
            )}
          </Field>
        </Stack>
        <Stack spacing={0.5}>
          <Typography>DESCRIPTION</Typography>
          <Field name="description">
            {({
              state: { value },
              handleBlur,
              handleChange,
            }) => (
              <TextField
                multiline
                minRows={5}
                value={value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </Stack>
        <Stack alignItems="start">
          <Subscribe
            selector={({ canSubmit, isSubmitting }) => ({
              canSubmit,
              isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
              <TypographyButton
                onClick={() => {
                  if (!canSubmit) {
                    return
                  }
                  handleSubmit()
                }}
              >
                {canSubmit && `[UPDATE]`}
                {isSubmitting && `[SUBMITTING]`}
              </TypographyButton>
            )}
          </Subscribe>
        </Stack>
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
