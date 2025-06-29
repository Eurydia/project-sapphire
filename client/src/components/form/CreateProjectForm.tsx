import { createProject } from "@/api/projects";
import type { CreateProjectDto } from "@/types/projects/dto/create-project.dto";
import type { Project } from "@/types/projects/project.entity";
import { RotateLeftRounded } from "@mui/icons-material";
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
import { use, type FC } from "react";
import { z } from "zod";
import { TagInput } from "../form-input/TagInput";
import { TextInput } from "../form-input/TextInput";

type Props = {
  topicOptionsPromise: Promise<string[]>;
  techOptionsPromise: Promise<string[]>;
  onSubmitSuccess: (project: Project) => unknown;
  onError: (error: any) => unknown;
};
export const CreateProjectForm: FC<Props> = ({
  techOptionsPromise,
  topicOptionsPromise,
  onSubmitSuccess,
  onError,
}) => {
  const topicOptions = use(topicOptionsPromise);
  const techOptions = use(techOptionsPromise);

  const { handleSubmit, Field, Subscribe, resetField } = useForm({
    defaultValues: {
      name: "",
      absPath: "",
      description: "",
      technologies: [],
      topics: [],
    } as CreateProjectDto,
    onSubmit: ({ value, formApi }) => {
      createProject(value)
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
        <Grid size={{ md: 3 }}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
          >
            <Typography>{`Project Name`}</Typography>
            <IconButton
              size="small"
              disableTouchRipple
              onClick={() => resetField("name")}
            >
              <RotateLeftRounded />
            </IconButton>
          </Stack>
        </Grid>
        <Grid size={{ md: 9 }}>
          <Field
            name="name"
            validators={{ onChange: z.string().min(3) }}
            children={({ state, handleChange, handleBlur }) => {
              const { value, meta } = state;
              const { isTouched, errors } = meta;
              return (
                <TextInput
                  minRow={1}
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
        <Grid size={{ md: 3 }}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
          >
            <Typography>{`Path`}</Typography>
            <IconButton
              size="small"
              disableTouchRipple
              onClick={() => resetField("absPath")}
            >
              <RotateLeftRounded />
            </IconButton>
          </Stack>
        </Grid>
        <Grid size={{ md: 9 }}>
          <Field
            name="absPath"
            validators={{ onChange: z.string().min(1) }}
            children={({ state, handleChange, handleBlur }) => {
              const { value, meta } = state;
              const { isTouched, errors } = meta;
              return (
                <TextInput
                  minRow={1}
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
        <Grid size={{ md: 3 }}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
          >
            <Typography>{`Description`}</Typography>
            <IconButton
              size="small"
              disableTouchRipple
              onClick={() => resetField("description")}
            >
              <RotateLeftRounded />
            </IconButton>
          </Stack>
        </Grid>
        <Grid size={{ md: 9 }}>
          <Field
            name="description"
            children={({ state, handleChange, handleBlur }) => (
              <TextInput
                value={state.value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Description"
                fullWidth
                minRow={6}
              />
            )}
          />
        </Grid>
        <Grid size={{ md: 3 }}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
          >
            <Typography>{`Topics`}</Typography>
            <IconButton
              size="small"
              disableTouchRipple
              onClick={() => resetField("topics")}
            >
              <RotateLeftRounded />
            </IconButton>
          </Stack>
        </Grid>
        <Grid size={{ md: 9 }}>
          <Field name="topics">
            {({ state, pushValue, removeValue }) => (
              <TagInput
                placeholder="Topics"
                items={state.value}
                options={topicOptions}
                onAdd={pushValue}
                onRemove={removeValue}
              />
            )}
          </Field>
        </Grid>
        <Grid size={{ md: 3 }}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
          >
            <Typography>{`Technologies`}</Typography>
            <IconButton
              size="small"
              disableTouchRipple
              onClick={() => resetField("technologies")}
            >
              <RotateLeftRounded />
            </IconButton>
          </Stack>
        </Grid>
        <Grid size={{ md: 9 }}>
          <Field name="technologies" mode="array">
            {({ state, pushValue, removeValue }) => (
              <TagInput
                placeholder="Technologies"
                items={state.value}
                options={techOptions}
                onAdd={pushValue}
                onRemove={removeValue}
              />
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
