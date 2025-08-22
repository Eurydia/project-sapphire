import { Stack, TextField, Typography } from "@mui/material"
import { useForm } from "@tanstack/react-form"
import type { FC } from "react"
import { z } from "zod/v4"
import { TypographyButton } from "../input/typography-button"

type Props = { uuid: string; onSubmit: () => unknown }
export const ProjectDeleteForm: FC<Props> = ({
  uuid,
  onSubmit,
}) => {
  const { handleSubmit, Field, Subscribe } = useForm({
    defaultValues: { uuid: "" },
    validators: {
      onChange: z.object({
        uuid: z.uuidv4().refine((arg) => arg === uuid),
      }),
    },
    onSubmit: ({ formApi }) => {
      formApi.reset()
      onSubmit()
    },
  })
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography
          display="flex"
          flexDirection="row"
          gap={1}
          component="div"
        >
          {`TYPE`}
          <Typography
            component="code"
            sx={{ cursor: "pointer" }}
            onClick={() => navigator.clipboard.writeText(uuid)}
          >
            {`[[${uuid}]]`}
          </Typography>
          {`TO CONFIRM DELETE`}
        </Typography>
        <Field name="uuid">
          {({
            state: { value, meta },
            handleBlur,
            handleChange,
          }) => (
            <TextField
              value={value}
              error={meta.errors.length > 0}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
            />
          )}
        </Field>
      </Stack>
      <Subscribe selector={({ canSubmit }) => ({ canSubmit })}>
        {({ canSubmit }) => (
          <TypographyButton
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {`[CONFIRM]`}
          </TypographyButton>
        )}
      </Subscribe>
    </Stack>
  )
}
