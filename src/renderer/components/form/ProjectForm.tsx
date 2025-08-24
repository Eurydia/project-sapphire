import type { ProjectFormData } from "@/types/project-form-data"
import {
  Button,
  Chip,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material"
import { useForm } from "@tanstack/react-form"
import { memo, type FC } from "react"
import { AutocompleteTextField } from "../input/AutocompeleteTextField"
import { TextFieldFileContentInput } from "../input/text-field-file-content-input"

type Props = {
  init?: ProjectFormData
  action: (value: ProjectFormData) => unknown
  formOptions: {
    tags: string[]
  }
}
export const ProjectForm: FC<Props> = memo(
  ({ init, action, formOptions }) => {
    const { Field, Subscribe, handleSubmit } = useForm({
      defaultValues: init ?? {
        description: "",
        name: "",
        techNames: [],
        topicNames: [],
        tagNames: [],
      },
      onSubmit: ({ value }) => {
        action(value)
      },
    })

    return (
      <Stack
        component="form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography>{`NAME`}</Typography>
            <Field name="name">
              {({
                state: { value, meta },
                handleChange,
                handleBlur,
              }) => (
                <TextField
                  error={
                    meta.errors.length > 0 && meta.isTouched
                  }
                  fullWidth
                  multiline
                  minRows={1}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  value={value}
                />
              )}
            </Field>
          </Stack>
          <Stack spacing={1}>
            <Typography>{`DESCRIPTION`}</Typography>
            <Field name="description">
              {({
                state: { value, meta },
                handleChange,
                handleBlur,
              }) => (
                <TextFieldFileContentInput
                  error={
                    meta.isTouched && meta.errors.length > 0
                  }
                  value={value}
                  onChange={handleChange}
                  minRows={5}
                  multiline
                  onBlur={handleBlur}
                />
              )}
            </Field>
          </Stack>
          <Stack spacing={1}>
            <Typography>{`TAGS`}</Typography>
            <Field name="tagNames" mode="array">
              {({
                state: { value, meta },
                removeValue,
                pushValue,
                handleBlur,
              }) => (
                <Stack spacing={0.5}>
                  <AutocompleteTextField
                    error={
                      meta.isTouched && meta.errors.length > 0
                    }
                    placeholder={`${value.length} SELECTED`}
                    onSelect={pushValue}
                    options={formOptions.tags}
                    disabledOptions={value}
                    onBlur={handleBlur}
                  />
                  <Stack
                    spacing={0.5}
                    direction="row"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {value.map((_, index) => (
                      <Field
                        key={index}
                        name={`tagNames[${index}]`}
                      >
                        {(subfield) => (
                          <Chip
                            variant="outlined"
                            label={subfield.state.value}
                            onDelete={() => removeValue(index)}
                            sx={{ widthh: "fit-content" }}
                          />
                        )}
                      </Field>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Field>
          </Stack>
          <Subscribe
            selector={({
              isPristine,
              isSubmitting,
              isValid,
            }) => ({
              isPristine,
              isSubmitting,
              isValid,
            })}
          >
            {({ isSubmitting, isValid, isPristine }) => (
              <Toolbar disableGutters variant="dense">
                <Button
                  variant="contained"
                  disabled={isPristine || !isValid}
                  onClick={() => handleSubmit()}
                >
                  {isSubmitting ? "..." : "confirm"}
                </Button>
              </Toolbar>
            )}
          </Subscribe>
        </Stack>
      </Stack>
    )
  },
)
