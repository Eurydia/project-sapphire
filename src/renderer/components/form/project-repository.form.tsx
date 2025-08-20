import {
  projectRepositoryFormDataSchema,
  type ProjectRepositoryFormData,
} from "@/types/form-data/project-repository"
import { Stack, TextField, Typography } from "@mui/material"
import { useForm } from "@tanstack/react-form"
import type { FC } from "react"
import { TypographyButton } from "../input/typography-button"

type Props = {
  init?: ProjectRepositoryFormData
  onSubmit: (formData: ProjectRepositoryFormData) => unknown
}
export const ProjectRepositoryForm: FC<Props> = ({
  onSubmit,
  init,
}) => {
  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: init ?? {
      description: "",
      name: "",
      url: "",
    },
    onSubmit: ({ value, formApi: { reset } }) => {
      onSubmit(value)
      reset()
    },
    validators: { onChange: projectRepositoryFormDataSchema },
  })

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography>{`NAME`}</Typography>
        <Field name="name">
          {({
            state: {
              value,
              meta: { isDirty, errors },
            },
            handleBlur,
            handleChange,
          }) => (
            <TextField
              value={value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              error={isDirty && errors.length > 0}
            />
          )}
        </Field>
      </Stack>
      <Stack>
        <Typography>{`URL`}</Typography>
        <Field name="url">
          {({
            state: {
              value,
              meta: { isDirty, errors },
            },
            handleBlur,
            handleChange,
          }) => (
            <TextField
              value={value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              error={isDirty && errors.length > 0}
            />
          )}
        </Field>
      </Stack>
      <Stack>
        <Typography>{`DESC`}</Typography>
        <Field name="description">
          {({
            state: {
              value,
              meta: { errors, isDirty },
            },
            handleBlur,
            handleChange,
          }) => (
            <TextField
              value={value}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
              error={isDirty && errors.length > 0}
            />
          )}
        </Field>
      </Stack>
      <Stack direction="row">
        <Subscribe
          selector={({ canSubmit, isSubmitting }) => ({
            canSubmit,
            isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <TypographyButton
              disabled={!canSubmit || isSubmitting}
              onClick={handleSubmit}
            >
              {`[SUBMIT]`}
            </TypographyButton>
          )}
        </Subscribe>
      </Stack>
    </Stack>
  )
}
