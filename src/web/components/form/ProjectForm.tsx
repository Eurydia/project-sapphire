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
import { AutocompleteTextField } from "~/components/input/AutocompeleteTextField";
import {
  type ProjectDto,
  projectDtoSchema,
} from "~/models/project/dto/create-project";

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
    validators: { onChangeAsync: projectDtoSchema.parseAsync },
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
              <Grid size={{ md: 3 }}>{`Name`}</Grid>
              <Grid size={{ md: 9 }}>
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
              <Grid size={{ md: 3 }}>{`root`}</Grid>
              <Grid size={{ md: 9 }}>
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
                          <IconButton onClick={async () => console.debug()}>
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
              <Grid size={{ md: 3 }}>{`description`}</Grid>
              <Grid size={{ md: 9 }}>
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
          {({ state, removeValue, pushValue, handleBlur }) => {
            return (
              <>
                <Grid size={{ md: 3 }}>{`topics`}</Grid>
                <Grid size={{ md: 9 }}>
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
                </Grid>
              </>
            );
          }}
        </Field>
        <Field name="technologies" mode="array">
          {({ state, removeValue, pushValue, handleBlur }) => (
            <>
              <Grid size={{ md: 3 }}>{`Technologies`}</Grid>
              <Grid size={{ md: 9 }}>
                <AutocompleteTextField
                  onSelect={pushValue}
                  options={options.technologies}
                  disabledOptions={state.value}
                  onBlur={handleBlur}
                  placeholder="Technologies"
                />
                <Stack spacing={0.5} direction="row" flexWrap="wrap" useFlexGap>
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
