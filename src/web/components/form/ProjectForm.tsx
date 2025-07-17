import { FolderOutlined } from "@mui/icons-material";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import type { FC } from "react";
import { memo } from "react";
import { openDirDialog } from "~/api/fs";
import { AutocompleteTextField } from "~/components/input/AutocompeleteTextField";
import { type ProjectDto } from "~/models/project/dto/create-project";

type Props = {
  init?: ProjectDto;
  action: (value: ProjectDto) => unknown;
  options: {
    topics: Array<string>;
    technologies: Array<string>;
  };
};
export const ProjectForm: FC<Props> = memo(({ init, action, options }) => {
  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues:
      init ??
      ({
        description: "",
        name: "",
        root: "",
        technologies: [],
        topics: [],
      } as ProjectDto),
    onSubmit: ({ value }) => {
      action(value);
    },
  });
  return (
    <Stack
      component="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
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
                  onChange={(e) => handleChange(e.target.value)}
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
                  onChange={(e) => handleChange(e.target.value)}
                  value={state.value}
                  required
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              openDirDialog().then(
                                ({ canceled, filePaths }) => {
                                  if (canceled) {
                                    return;
                                  }
                                  const path = filePaths.at(0);
                                  if (path === undefined) {
                                    return;
                                  }
                                  handleChange(path);
                                }
                              )
                            }
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
                  onChange={(e) => handleChange(e.target.value)}
                  value={state.value}
                />
              </Grid>
            </>
          )}
        </Field>
        <Field name="topics" mode="array">
          {({ state, removeValue, pushValue, handleBlur }) => (
            <>
              <Grid size={3}>{`topics`}</Grid>
              <Grid size={9}>
                <Stack spacing={0.5} direction="column">
                  <AutocompleteTextField
                    onSelect={pushValue}
                    options={options.technologies}
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
                      <Field key={index} name={`topics[${index}]`}>
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
        <Field name="technologies" mode="array">
          {({ state, removeValue, pushValue, handleBlur }) => (
            <>
              <Grid size={3}>{`Technologies`}</Grid>
              <Grid size={9}>
                <Stack spacing={0.5}>
                  <AutocompleteTextField
                    onSelect={pushValue}
                    options={options.technologies}
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
                      <Field key={index} name={`technologies[${index}]`}>
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
          selector={({ isPristine, isSubmitting, isValid }) => ({
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
  );
});
