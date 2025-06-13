import { ProjectCard } from "@/components/ProejctCard";
import { StyledLink } from "@/components/StyledLink";
import { ProjectsService } from "@/services/projects.services";
import {
  AddRounded,
  FilterListRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { type FC } from "react";
import { z } from "zod";

const RouteComponent: FC = () => {
  const { projects, search } = Route.useLoaderData();

  return (
    <Box sx={{ maxWidth: "lg", marginX: "auto", padding: 4 }}>
      <Stack spacing={1}>
        <Toolbar disableGutters variant="dense">
          <StyledLink to="/projects/create">
            <Button disableElevation disableRipple variant="contained">
              <AddRounded />
            </Button>
          </StyledLink>
        </Toolbar>
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
            </Stack>
            <Typography>{projects.projectCountMsg}</Typography>
          </Stack>
        </Toolbar>
        {projects.projects.map((project) => {
          return <ProjectCard project={project} key={project.id} />;
        })}
      </Stack>
    </Box>
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
  loader: async ({ deps }) => {
    const projects = await ProjectsService.findAll();
    const projectCount = projects.length;
    let projectCountMsg = "";
    if (projectCount <= 1) {
      projectCountMsg = `Showing ${projects.length} item`;
    } else {
      projectCountMsg = `Showing ${projects.length} items`;
    }
    return {
      projects: { projects, projectCountMsg, projectCount },
      search: deps.search,
    };
  },
});
