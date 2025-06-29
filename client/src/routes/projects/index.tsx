import { fetchAllProject } from "@/api/projects";
import { ProjectList } from "@/components/data-display/ProjectList";
import { SearchRounded } from "@mui/icons-material";
import { Box, Button, Grid, Paper, TextField, Toolbar } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useRef, type FC } from "react";
import { z } from "zod";

const RouteComponent: FC = () => {
  const { projectsPromise, search } = Route.useLoaderData();

  const searchFieldRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Grid container spacing={2} sx={{ padding: 2, paddingBottom: 0 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              padding: 1,
              position: "sticky",
              top: 20,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              sx={{ display: "contents" }}
            >
              <TextField
                inputRef={searchFieldRef}
                name="name"
                fullWidth
                autoComplete="off"
                defaultValue={search.name}
                placeholder="Search project"
              />
              <Toolbar disableGutters variant="dense">
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disableRipple
                >
                  <SearchRounded />
                </Button>
              </Toolbar>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <ProjectList projectsPromise={projectsPromise} />
        </Grid>
      </Grid>
    </>
  );
};

const searchParamSchema = z.object({
  name: fallback(z.string().optional(), undefined).catch(undefined),
  technologies: fallback(z.string().array().optional(), undefined).catch(
    undefined,
  ),
  topics: fallback(z.string().array().optional(), undefined).catch(undefined),
  status: fallback(z.string().optional(), undefined).catch(undefined),
});

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  loaderDeps: ({ search }) => {
    return { search };
  },
  validateSearch: zodValidator(searchParamSchema),
  loader: ({ deps }) => {
    const projectsPromise = fetchAllProject();
    return {
      projectsPromise,
      search: deps.search,
    };
  },
});
