import { CreateProjectForm } from "@/components/CreateProjectForm";
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";
import { ProjectCardSkeleton } from "@/components/ProjectCard/ProjectCardSkeleton";
import { ProjectService } from "@/services/projects.service";
import { AddRounded, SearchRounded } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Await,
  CatchBoundary,
  createFileRoute,
  defer,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import {
  Fragment,
  Suspense,
  useEffect,
  useRef,
  useState,
  type FC,
} from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const RouteComponent: FC = () => {
  const { projectsPromise, search } = Route.useLoaderData();

  const router = useRouter();
  const { location } = useRouterState();
  const [createDialogActive, setCreateDialogActive] = useState(false);
  const searchFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && e.altKey && searchFieldRef.current !== null) {
        e.preventDefault();
        e.stopPropagation();
        searchFieldRef.current.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
          <Paper variant="outlined" sx={{ padding: 1 }}>
            <Stack spacing={1}>
              <CatchBoundary
                getResetKey={() => location.state.key!}
                errorComponent={({ error }) => (
                  <Fragment>
                    <Alert
                      severity="error"
                      // action={
                      //   <Button
                      //     color="inherit"
                      //     size="small"
                      //     onClick={() => {
                      //       reset();
                      //       router.invalidate({ sync: true });
                      //     }}
                      //   >
                      //     Retry
                      //   </Button>
                      // }
                      sx={{ mb: 2 }}
                    >
                      <AlertTitle>Error loading projects</AlertTitle>
                      {error.message}
                    </Alert>
                  </Fragment>
                )}
              >
                <Suspense
                  fallback={
                    <Fragment>
                      <ProjectCardSkeleton />
                      <ProjectCardSkeleton />
                      <ProjectCardSkeleton />
                    </Fragment>
                  }
                >
                  <Await promise={projectsPromise}>
                    {(projects) => (
                      <Fragment>
                        <Typography>
                          {projects.length <= 1
                            ? `Showing ${projects.length} item`
                            : `Showing ${projects.length} items`}
                        </Typography>
                        {projects.map((project) => (
                          <ProjectCard project={project} key={project.id} />
                        ))}
                      </Fragment>
                    )}
                  </Await>
                </Suspense>
              </CatchBoundary>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        scroll="paper"
        maxWidth="md"
        fullWidth
        open={createDialogActive}
        onClose={() => setCreateDialogActive(false)}
      >
        <DialogTitle>
          <Typography>New Project</Typography>
        </DialogTitle>
        <DialogContent>
          <CreateProjectForm
            onSubmitSuccess={() => {
              toast.success("Project added");
              setCreateDialogActive(false);
              router.invalidate({ sync: true });
            }}
            onError={() => {
              toast.error("Failed to add project");
            }}
          />
        </DialogContent>
      </Dialog>
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
    const projectsPromise = ProjectService.findAll();
    return {
      projectsPromise: defer(projectsPromise),
      search: deps.search,
    };
  },
});
