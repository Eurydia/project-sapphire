import { updateProjectTagDtoSchema } from "#/models/project-tag/dto/update-project-tag.dto"
import { ProjectTagService } from "@/api/project-tag.service"
import {
  Button,
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
import { memo, type FC } from "react"
import { toast } from "react-toastify"

const RouteComponent: FC = memo(() => {
  const { tag } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      name: tag.name,
      description: tag.description,
    },
    validators: { onChangeAsync: updateProjectTagDtoSchema },
    onSubmit: () => {
      navigate({
        to: "/project-tags/$uuid",
        params: { uuid: tag.uuid },
      })
      toast.info("!!PLACEHOLDER!!")
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
          <Typography>DESC</Typography>
          <TextField
            multiline
            minRows={5}
            defaultValue={tag.description}
          />
        </Stack>
        <Stack alignItems="start">
          <Subscribe
            selector={({
              canSubmit,
              isSubmitting,
              isValidating,
            }) => ({ canSubmit, isSubmitting, isValidating })}
          >
            {({ canSubmit, isSubmitting, isValidating }) => (
              <Button
                disableElevation
                disabled={
                  !canSubmit || isSubmitting || isValidating
                }
                onClick={handleSubmit}
              >
                {`CONFIRM`}
              </Button>
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
