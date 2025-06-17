import { CreateProjectForm } from "@/components/CreateProjectForm";
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";
import { ProjectCardSkeleton } from "@/components/ProjectCard/ProjectCardSkeleton";
import { ProjectService } from "@/services/projects.services";
import {
  AddRounded,
  FilterListRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Await,
  createFileRoute,
  defer,
  useRouter,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Fragment, Suspense, useState, type FC } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const RouteComponent: FC = () => {
  const { projectsPromise, search } = Route.useLoaderData();
  const router = useRouter();
  const [createDialogActive, setCreateDialogActive] = useState(false);

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
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 1,
              }}
              component="form"
            >
              <TextField
                name="name"
                fullWidth
                autoComplete="off"
                defaultValue={search.name}
                placeholder="Search project"
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Stack direction="row" spacing={1} useFlexGap>
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disableRipple
                  >
                    <SearchRounded />
                  </Button>
                  <Button variant="outlined" disableElevation disableRipple>
                    <FilterListRounded />
                  </Button>
                  <Button
                    disableElevation
                    disableRipple
                    variant="outlined"
                    onClick={() => setCreateDialogActive(true)}
                  >
                    <AddRounded />
                  </Button>
                </Stack>
              </Stack>
            </Toolbar>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={1}>
            <Suspense>
              <Await
                promise={projectsPromise}
                fallback={
                  <Fragment>
                    <Typography>
                      <Skeleton width="20ch" />
                    </Typography>
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                  </Fragment>
                }
              >
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
          </Stack>
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
