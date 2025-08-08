import {
  projectTagFormDataSchema,
  type ProjectTagFormData,
} from "@/types/project-tag.form-data"
import { Stack, TextField, Typography } from "@mui/material"
import { useForm } from "@tanstack/react-form"
import type { FC } from "react"
import { TypographyButton } from "../input/typography-button"

type Props = {
  init?: ProjectTagFormData
  onSubmit: (formData: ProjectTagFormData) => unknown
}
export const ProjectTagForm: FC<Props> = ({
  init,
  onSubmit,
}) => {
  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: init ?? { name: "", description: "" },
    validators: {
      onChangeAsync: projectTagFormDataSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <Stack spacing={2}>
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
          {({ state: { value }, handleBlur, handleChange }) => (
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
              {canSubmit && `[SUBMIT]`}
              {isSubmitting && `[SUBMITTING]`}
            </TypographyButton>
          )}
        </Subscribe>
      </Stack>
    </Stack>
  )
}
