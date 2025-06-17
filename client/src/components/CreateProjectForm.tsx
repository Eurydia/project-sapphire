import { ProjectService } from "@/services/projects.services";
import type { CreateProjectDto } from "@/types/projects/dto/create-project.dto";
import type { Project } from "@/types/projects/project.entity";
import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Toolbar,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useState, type FC } from "react";
import z from "zod";

type Props = {
  onSubmitSuccess: (project: Project) => unknown;
  onError: (error: any) => unknown;
};
export const CreateProjectForm: FC<Props> = ({ onSubmitSuccess, onError }) => {
  const [isBusy, setIsBusy] = useState(false);
  const { handleSubmit, Field } = useForm({
    defaultValues: {
      name: "",
      absPath: "",
      description: "",
      technologies: [],
      topics: [],
    } as CreateProjectDto,
    onSubmit: ({ value, formApi }) => {
      setIsBusy(true);
      ProjectService.create(value)
        .then((project) => {
          formApi.reset();
          onSubmitSuccess(project);
        })
        .catch(onError)
        .finally(() => setIsBusy(false));
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
      <Grid container spacing={2} sx={{ paddingY: 2 }}>
        <Grid size={{ md: 12 }}>
          <Field
            name="name"
            validators={{ onChange: z.string().min(3) }}
            children={({ state, handleChange, handleBlur }) => {
              const { value, meta } = state;
              const { isTouched, errors } = meta;
              return (
                <TextField
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  label="Name"
                  fullWidth
                  error={isTouched && errors.length > 0}
                  helperText={
                    isTouched
                      ? errors.map((err) => err?.message ?? "").join(",")
                      : ""
                  }
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
                <TextField
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  label="Absolute path to project"
                  fullWidth
                  error={isTouched && errors.length > 0}
                  helperText={isTouched ? errors.join(", ") : ""}
                />
              );
            }}
          />
        </Grid>
        <Grid size={{ md: 12 }}>
          <Field
            name="description"
            children={({ state, handleChange, handleBlur }) => (
              <TextField
                value={state.value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                label="Description"
                fullWidth
                multiline
                rows={6}
              />
            )}
          />
        </Grid>
        <Grid size={{ md: 6 }}>
          <Field
            name="topics"
            children={({ state, handleChange }) => (
              <Autocomplete
                multiple
                freeSolo
                options={[] as string[]}
                value={state.value}
                onChange={(_, newValue) => handleChange(newValue)}
                renderValue={(value, getItemProps) =>
                  value.map((option, index) => {
                    const { key, ...rest } = getItemProps({ index });
                    return (
                      <Chip
                        label={option}
                        key={`topic-option-${key}`}
                        {...rest}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Topics" fullWidth />
                )}
                slotProps={{
                  chip: { variant: "outlined", size: "small" },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ md: 6 }}>
          <Field
            name="technologies"
            children={({ state, handleChange }) => (
              <Autocomplete
                multiple
                freeSolo
                options={[] as string[]}
                value={state.value}
                onChange={(_, newValue) => handleChange(newValue)}
                renderValue={(value, getItemProps) =>
                  value.map((option, index) => {
                    const { key, ...rest } = getItemProps({ index });
                    return (
                      <Chip
                        label={option}
                        key={`topic-option-${key}`}
                        {...rest}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Technologies" fullWidth />
                )}
                slotProps={{
                  chip: { variant: "outlined", size: "small" },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ md: 12 }}>
          <Toolbar variant="dense" disableGutters>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={isBusy}
            >
              {`Create`}
              {isBusy && (
                <CircularProgress
                  variant="indeterminate"
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Button>
          </Toolbar>
        </Grid>
      </Grid>
    </form>
  );
};
