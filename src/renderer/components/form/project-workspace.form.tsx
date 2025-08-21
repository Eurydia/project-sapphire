import {
  projectWorkspaceFormDataSchema,
  type ProjectWorkspaceFormData,
} from "@/types/form-data/project-workspace"
import { Stack, TextField, Typography } from "@mui/material"
import { useForm } from "@tanstack/react-form"
import type { FC } from "react"
import { DirectoryInput } from "../input/directory-input"
import { TypographyButton } from "../input/typography-button"

type Props = {
  init?: ProjectWorkspaceFormData
  onSubmit: (formData: ProjectWorkspaceFormData) => unknown
}
export const ProjectWorkspaceForm: FC<Props> = ({
  onSubmit,
  init,
}) => {
  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: init ?? {
      name: "",
      root: "",
    },
    onSubmit: ({ value, formApi: { reset } }) => {
      onSubmit(value)
      reset()
    },
    validators: { onChange: projectWorkspaceFormDataSchema },
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
        <Typography>{`ROOT`}</Typography>
        <Field name="root">
          {({
            state: {
              value,
              meta: { isDirty, errors },
            },
            handleBlur,
            handleChange,
          }) => (
            <DirectoryInput
              onBlur={handleBlur}
              onChange={handleChange}
              value={value}
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
