import { ProjectService } from "@/services/projects.service";
import type { CreateProjectDto } from "@/types/projects/dto/create-project.dto";
import type { Project } from "@/types/projects/project.entity";
import { DeleteRounded } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { Fragment, type FC } from "react";
import { z } from "zod";
import { TextInput } from "../form-input/TextInput";

type Props = {
  onSubmitSuccess: (project: Project) => unknown;
  onError: (error: any) => unknown;
};
export const CreateProjectForm: FC<Props> = ({ onSubmitSuccess, onError }) => {
  const { handleSubmit, Field, Subscribe } = useForm({
    defaultValues: {
      name: "",
      absPath: "",
      description: "",
      technologies: [],
      topics: [],
    } as CreateProjectDto,
    onSubmit: ({ value, formApi }) => {
      ProjectService.create(value)
        .then((project) => {
          formApi.reset();
          onSubmitSuccess(project);
        })
        .catch(onError);
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(e);
      }}
    >
      <Grid container spacing={1}>
        <Grid size={{ md: 12 }}>
          <Typography variant="h5" fontWeight={900}>
            New Project
          </Typography>
        </Grid>
        <Grid size={{ md: 12 }}>
          <Field
            name="name"
            validators={{ onChange: z.string().min(3) }}
            children={({ state, handleChange, handleBlur }) => {
              const { value, meta } = state;
              const { isTouched, errors } = meta;
              return (
                <TextInput
                  fullWidth
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Project name"
                  error={isTouched && errors.length > 0}
                />
              );
            }}
          />
        </Grid>
        <Grid size={{ md: 12 }}>
          <Field
            name="absPath"
            validators={{ onChange: z.string().min(1) }}
            children={({ state, handleChange, handleBlur }) => {
              const { value, meta } = state;
              const { isTouched, errors } = meta;
              return (
                <TextInput
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Absolute path to project"
                  fullWidth
                  error={isTouched && errors.length > 0}
                />
              );
            }}
          />
        </Grid>
        <Grid size={{ md: 12 }}>
          <Field
            name="description"
            children={({ state, handleChange, handleBlur }) => (
              <TextInput
                value={state.value ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Description"
                fullWidth
                minRow={6}
              />
            )}
          />
        </Grid>
        <Grid size={{ md: 6 }}>
          <Field name="topics" mode="array">
            {({ state, pushValue, removeValue }) => (
              <>
                <Stack spacing={0.5}>
                  {state.value.map((_, i) => (
                    <Field key={`topic-item-${i}`} name={`topics[${i}]`}>
                      {(subField) => (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <TextInput
                            size="small"
                            value={subField.state.value}
                            onChange={subField.handleChange}
                            fullWidth
                          />
                          <IconButton
                            disableFocusRipple
                            disableRipple
                            disableTouchRipple
                            onClick={() => removeValue(i)}
                          >
                            <DeleteRounded />
                          </IconButton>
                        </Stack>
                      )}
                    </Field>
                  ))}
                </Stack>
                <Button
                  disableElevation
                  variant="contained"
                  onClick={() => pushValue("")}
                >
                  add topic
                </Button>
              </>
            )}
          </Field>
        </Grid>

        <Grid size={{ md: 6 }}>
          <Field name="technologies" mode="array">
            {({ state, pushValue }) => (
              <Fragment>
                {state.value.map((_, i) => (
                  <Field key={`tech-item-${i}`} name={`technologies[${i}]`}>
                    {(subField) => (
                      <TextInput
                        value={subField.state.value}
                        onChange={subField.handleChange}
                        fullWidth
                      />
                    )}
                  </Field>
                ))}
                <Button
                  disableElevation
                  variant="contained"
                  onClick={() => pushValue("")}
                >
                  add technology
                </Button>
              </Fragment>
            )}
          </Field>
        </Grid>
        <Grid size={{ md: 12 }}>
          <Toolbar variant="dense" disableGutters>
            <Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  variant="contained"
                  disableElevation
                  type="submit"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? (
                    <CircularProgress variant="indeterminate" size={24} />
                  ) : (
                    "Create"
                  )}
                </Button>
              )}
            />
          </Toolbar>
        </Grid>
      </Grid>
    </form>
  );
};
