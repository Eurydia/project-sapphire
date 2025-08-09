import { FileSystemService } from "@/api/file-system.service"
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
import { memo, useRef, type FC } from "react"
import { AutocompleteTextField } from "../input/AutocompeleteTextField"
import { TypographyButton } from "../input/typography-button"

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
        root: "",
        techNames: [],
        topicNames: [],
        tagNames: [],
      },
      onSubmit: ({ value }) => {
        action(value)
      },
    })

    const dirDialogOpenedRef = useRef(false)

    return (
      <Stack
        component="form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Stack spacing={1}>
          <Stack>
            <TypographyButton>{`NAME`}</TypographyButton>
            <Field name="name">
              {({ state, handleChange, handleBlur }) => (
                <TextField
                  fullWidth
                  multiline
                  required
                  minRows={1}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  value={state.value}
                />
              )}
            </Field>
          </Stack>
          <Stack>
            <Typography>{`ROOT`}</Typography>
            <Field name="root">
              {({ state, handleChange, handleBlur }) => (
                <Stack spacing={1} alignItems="start">
                  <TextField
                    fullWidth
                    multiline
                    minRows={1}
                    onBlur={handleBlur}
                    onChange={(e) =>
                      handleChange(e.target.value)
                    }
                    value={state.value}
                    required
                  />
                  <TypographyButton
                    onClick={async () => {
                      if (dirDialogOpenedRef.current) {
                        return
                      }
                      dirDialogOpenedRef.current = true
                      const { canceled, filePaths } =
                        await FileSystemService.openDirDialog()
                      dirDialogOpenedRef.current = false
                      if (canceled) {
                        return
                      }
                      const path = filePaths.at(0)
                      if (path === undefined) {
                        return
                      }
                      handleChange(path)
                    }}
                  >
                    {`[OPEN SYSTEM BROWSER]`}
                  </TypographyButton>
                </Stack>
              )}
            </Field>
          </Stack>
          <Stack>
            <Typography>{`DESC`}</Typography>
            <Field name="description">
              {({ state, handleChange, handleBlur }) => (
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  value={state.value}
                />
              )}
            </Field>
          </Stack>
          <Stack>
            <Typography>{`TAGS`}</Typography>
            <Field name="tagNames" mode="array">
              {({
                state,
                removeValue,
                pushValue,
                handleBlur,
              }) => (
                <Stack spacing={0.5}>
                  <AutocompleteTextField
                    onSelect={pushValue}
                    options={formOptions.tags}
                    disabledOptions={state.value}
                    onBlur={handleBlur}
                  />
                  <Stack
                    spacing={0.5}
                    direction="row"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {state.value.map((_, index) => (
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
