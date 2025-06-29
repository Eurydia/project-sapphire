import { fetchAllProject } from "@/api/projects";
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";
import { ProjectCardSkeleton } from "@/components/ProjectCard/ProjectCardSkeleton";
import { AddRounded, SearchRounded } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material";
import {
  Await,
  CatchBoundary,
  createFileRoute,
  defer,
  useRouterState,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Fragment, Suspense, useRef, useState, type FC } from "react";
import { z } from "zod";

const RouteComponent: FC = () => {
  const { projectsPromise, search } = Route.useLoaderData();

  const { location } = useRouterState();
  const [createDialogActive, setCreateDialogActive] = useState(false);
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
            <Toolbar variant="dense" disableGutters>
              <Button
                disableElevation
                disableRipple
                variant="outlined"
                onClick={() => setCreateDialogActive(true)}
              >
                <AddRounded />
              </Button>
            </Toolbar>

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
          <Stack spacing={1}>
            <CatchBoundary
              getResetKey={() => location.state.key!}
              errorComponent={({ error }) => (
                <Alert severity="error">
                  <AlertTitle>Error loading projects</AlertTitle>
                  {error.message}
                </Alert>
              )}
            >
              <Suspense>
                <Await
                  promise={projectsPromise}
                  fallback={
                    <Fragment>
                      <ProjectCardSkeleton />
                      <ProjectCardSkeleton />
                      <ProjectCardSkeleton />
                    </Fragment>
                  }
                >
                  {(projects) =>
                    projects.map((project) => (
                      <ProjectCard project={project} key={project.id} />
                    ))
                  }
                </Await>
              </Suspense>
            </CatchBoundary>
          </Stack>
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
      projectsPromise: defer(projectsPromise),
      search: deps.search,
    };
  },
});
