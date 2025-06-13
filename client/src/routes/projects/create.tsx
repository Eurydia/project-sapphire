import { ProjectsService } from "@/services/projects.services";
import type { CreateProjectDto } from "@/types/projects/dto/create-project.dto";
import {
  Button,
  Container,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import React, { type FormEvent } from "react";
import { z } from "zod";

const RouteComponent: React.FC = () => {
  const { handleSubmit, Field } = useForm({
    defaultValues: {
      name: "qqq",
      absPath: "qq",
      description: "qq",
    } as CreateProjectDto,
    onSubmit: async ({ value }) => {
      await ProjectsService.create(value);
    },
  });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(e);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create New Project
      </Typography>
      <form onSubmit={handleFormSubmit} noValidate>
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
                label="Project Name"
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
                label="Absolute Path"
                fullWidth
                margin="normal"
                error={isTouched && errors.length > 0}
                helperText={isTouched ? errors.join(", ") : ""}
              />
            );
          }}
        />

        <Field
          name="description"
          children={({ state, handleChange, handleBlur }) => (
            <TextField
              value={state.value ?? ""}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          )}
        />
        <Toolbar variant="dense" disableGutters>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Toolbar>
      </form>
    </Container>
  );
};

export const Route = createFileRoute("/projects/create")({
  component: RouteComponent,
});
