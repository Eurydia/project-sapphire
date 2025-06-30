import { createProject } from "@/api/projects";
import {
  createProjectDtoSchema,
  type CreateProjectDto,
} from "@/types/projects/dto/create-project.dto";
import { RotateLeftRounded } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useForm, type StandardSchemaV1Issue } from "@tanstack/react-form";
import { memo, type FC, type ReactNode } from "react";
import { TagInput } from "../form-input/TagInput";
import { TextInput } from "../form-input/TextInput";

type FormItemProps = {
  label: string;
  children: ReactNode;
  onFieldReset: () => unknown;
  errors: (StandardSchemaV1Issue | undefined)[];
};
const FormItem: FC<FormItemProps> = memo(
  ({ errors, children, label, onFieldReset }) => {
    return (
      <Grid container spacing={1}>
        <Grid
          size={{ md: 3 }}
          gap={0.5}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography>{label}</Typography>
          <IconButton size="small" disableTouchRipple onClick={onFieldReset}>
            <RotateLeftRounded />
          </IconButton>
        </Grid>
        <Grid size={{ md: 9 }} gap={0.5} display="flex" flexDirection="column">
          {children}
          {errors.length > 0 && (
            <Alert severity="error">
              <AlertTitle>{`Error`}</AlertTitle>
              <List disablePadding dense>
                {errors.map((err, index) => (
                  <ListItem key={`field-errors[${index}]`}>
                    <ListItemText>{err?.message ?? ""}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}
        </Grid>
      </Grid>
    );
  },
);

type Props = {
  topicOptionsPromise: Promise<string[]>;
  techOptionsPromise: Promise<string[]>;
  onSubmitSuccess: () => unknown;
  onError: (error: any) => unknown;
};
export const CreateProjectForm: FC<Props> = ({
  techOptionsPromise,
  topicOptionsPromise,
  onSubmitSuccess,
  onError,
}) => {
  const { handleSubmit, Field, Subscribe, resetField } = useForm({
    validators: { onSubmitAsync: createProjectDtoSchema },
    defaultValues: {
      name: "",
      absPath: "",
      description: "",
      technologies: [],
      topics: [],
    } as CreateProjectDto,
    onSubmit: ({ value, formApi }) => {
      createProject(value)
        .then(() => {
          formApi.reset();
          onSubmitSuccess();
        })
        .catch(onError);
    },
  });

  return (
    <Stack
      spacing={2}
      component="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Typography variant="h5" fontWeight={900}>
        New Project
      </Typography>
      <Field name="name">
        {({
          state: {
            meta: { errors },
            value,
          },
          handleChange,
          handleBlur,
        }) => (
          <FormItem
            errors={errors}
            label="Project name"
            onFieldReset={() => resetField("name")}
          >
            <TextInput
              minRow={1}
              fullWidth
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Project name"
              error={errors.length > 0}
            />
          </FormItem>
        )}
      </Field>

      <Field name="absPath">
        {({
          state: {
            value,
            meta: { errors },
          },
          handleChange,
          handleBlur,
        }) => (
          <FormItem
            errors={errors}
            label="Path"
            onFieldReset={() => resetField("absPath")}
          >
            <TextInput
              minRow={1}
              fullWidth
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Absolute path to project"
              error={errors.length > 0}
            />
          </FormItem>
        )}
      </Field>
      <Field name="description">
        {({
          state: {
            value,
            meta: { errors },
          },
          handleChange,
          handleBlur,
        }) => (
          <FormItem
            errors={errors}
            label="Description"
            onFieldReset={() => resetField("description")}
          >
            <TextInput
              minRow={6}
              fullWidth
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Description"
              error={errors.length > 0}
            />
          </FormItem>
        )}
      </Field>
      <Field name="topics">
        {({
          state: {
            meta: { errors },
            value,
          },
          pushValue,
          removeValue,
        }) => (
          <FormItem
            errors={errors}
            label="Topics"
            onFieldReset={() => resetField("topics")}
          >
            <TagInput
              error={errors.length > 0}
              placeholder="Topics"
              items={value}
              optionsPromise={topicOptionsPromise}
              onAdd={pushValue}
              onRemove={removeValue}
            />
          </FormItem>
        )}
      </Field>
      <Field name="technologies" mode="array">
        {({
          state: {
            meta: { errors },
            value,
          },
          pushValue,
          removeValue,
        }) => (
          <FormItem
            errors={errors}
            label="Technologies"
            onFieldReset={() => resetField("technologies")}
          >
            <TagInput
              error={errors.length > 0}
              placeholder="Technologies"
              items={value}
              optionsPromise={techOptionsPromise}
              onAdd={pushValue}
              onRemove={removeValue}
            />
          </FormItem>
        )}
      </Field>
      <Toolbar variant="dense" disableGutters>
        <Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              variant="contained"
              disableElevation
              type="submit"
              disabled={!canSubmit}
              onClick={handleSubmit}
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
    </Stack>
  );
};
