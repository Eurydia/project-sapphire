import { openDirDialog } from "@/api/fs"
import type { ProjectFormData } from "@/types/project-form-data"
import { FolderOutlined } from "@mui/icons-material"
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material"
import { useForm } from "@tanstack/react-form"
import { memo, useRef, type FC } from "react"
import { AutocompleteTextField } from "../input/AutocompeleteTextField"

type Props = {
  init?: ProjectFormData
  action: (value: ProjectFormData) => unknown
  formOptions: {
    topics: string[]
    technologies: string[]
    groups: string[]
  }
}
export const ProjectForm: FC<Props> = memo(
  ({ init, action, formOptions }) => {
    const { Field, Subscribe, handleSubmit } = useForm({
      defaultValues:
        init ??
        ({
          description: "",
          name: "",
          root: "",
          techNames: [],
          topicNames: [],
          groupNames: [],
        } as ProjectFormData),
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
        <Grid container spacing={1}>
          <Field name="name">
            {({ state, handleChange, handleBlur }) => (
              <>
                <Grid size={3}>{`Name`}</Grid>
                <Grid size={9}>
                  <TextField
                    fullWidth
                    multiline
                    required
                    minRows={1}
                    placeholder="name"
                    onBlur={handleBlur}
                    onChange={(e) =>
                      handleChange(e.target.value)
                    }
                    value={state.value}
                  />
                </Grid>
              </>
            )}
          </Field>
          <Field name="root">
            {({ state, handleChange, handleBlur }) => (
              <>
                <Grid size={3}>{`root`}</Grid>
                <Grid size={9}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={1}
                    placeholder="Root"
                    onBlur={handleBlur}
                    onChange={(e) =>
                      handleChange(e.target.value)
                    }
                    value={state.value}
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={async () => {
                                if (dirDialogOpenedRef.current) {
                                  return
                                }
                                dirDialogOpenedRef.current = true
                                const { canceled, filePaths } =
                                  await openDirDialog()
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
                              <FolderOutlined />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </>
            )}
          </Field>
          <Field name="description">
            {({ state, handleChange, handleBlur }) => (
              <>
                <Grid size={3}>{`description`}</Grid>
                <Grid size={9}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    placeholder="Description"
                    onBlur={handleBlur}
                    onChange={(e) =>
                      handleChange(e.target.value)
                    }
                    value={state.value}
                  />
                </Grid>
              </>
            )}
          </Field>
          <Field name="groupNames" mode="array">
            {({ state, removeValue, pushValue, handleBlur }) => (
              <>
                <Grid size={3}>{`groups`}</Grid>
                <Grid size={9}>
                  <Stack spacing={0.5}>
                    <AutocompleteTextField
                      onSelect={pushValue}
                      options={formOptions.groups}
                      disabledOptions={state.value}
                      placeholder="groups"
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
                          name={`groupNames[${index}]`}
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
                </Grid>
              </>
            )}
          </Field>
          <Field name="topicNames" mode="array">
            {({ state, removeValue, pushValue, handleBlur }) => (
              <>
                <Grid size={3}>{`topics`}</Grid>
                <Grid size={9}>
                  <Stack spacing={0.5} direction="column">
                    <AutocompleteTextField
                      onSelect={pushValue}
                      options={formOptions.technologies}
                      disabledOptions={state.value}
                      onBlur={handleBlur}
                      placeholder="Topics"
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
                          name={`topicNames[${index}]`}
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
                </Grid>
              </>
            )}
          </Field>
          <Field name="techNames" mode="array">
            {({ state, removeValue, pushValue, handleBlur }) => (
              <>
                <Grid size={3}>{`Technologies`}</Grid>
                <Grid size={9}>
                  <Stack spacing={0.5}>
                    <AutocompleteTextField
                      onSelect={pushValue}
                      options={formOptions.technologies}
                      disabledOptions={state.value}
                      onBlur={handleBlur}
                      placeholder="Technologies"
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
                          name={`techNames[${index}]`}
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
                </Grid>
              </>
            )}
          </Field>
        </Grid>
        <Grid size={{ md: 12 }}>
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
        </Grid>
      </Stack>
    )
  },
)
