import type { Project } from "@/types/projects/project.entity";
import { Alert, AlertTitle, Stack, Typography } from "@mui/material";
import { CatchBoundary } from "@tanstack/react-router";
import { Fragment, memo, Suspense, use, type FC } from "react";
import { StyledLink } from "../StyledLink";
import { ProjectCard } from "./project-card/ProjectCard";
import { ProjectCardSkeleton } from "./project-card/ProjectCardSkeleton";

type Props = {
  projectsPromise: Promise<Project[]>;
};
const List_: FC<Props> = memo(({ projectsPromise }) => {
  const projects = use(projectsPromise);
  return (
    <Stack spacing={1}>
      {projects.length === 0 && (
        <Alert severity="info">
          <AlertTitle>{`Nothing to display.`}</AlertTitle>
          <StyledLink to="/projects/create" variant="body1">
            {`Create one`}
          </StyledLink>
        </Alert>
      )}
      {projects.map((project) => (
        <ProjectCard project={project} key={project.uuid} />
      ))}
    </Stack>
  );
});

export const ProjectList: FC<Props> = memo(({ projectsPromise }) => {
  return (
    <CatchBoundary
      getResetKey={() => "reset"}
      errorComponent={({ error }) => (
        <Alert severity="error">
          <AlertTitle>{`Error loading projects`}</AlertTitle>
          <Typography>{error.message}</Typography>
        </Alert>
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
        <List_ projectsPromise={projectsPromise} />
      </Suspense>
    </CatchBoundary>
  );
});
