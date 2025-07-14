import { Alert, Grid, Paper, Skeleton, Stack, Typography } from "@mui/material";
import type { FC } from "react";
import { Fragment, Suspense, memo, use } from "react";
import { ProjectCard } from "~/components/data-display/project-card";
import { StyledLink } from "~/components/navigation/styled-link";
import type { Project } from "~/models/project/project";
import { ProjectCardSkeleton } from "./project-card-skeleton";

type InternalListProps = {
  dense?: boolean;
  fetcher: Promise<Array<Project> | unknown>;
};
const Inner: FC<InternalListProps> = memo(({ dense, fetcher }) => {
  const items = use(fetcher);

  if (!Array.isArray(items)) {
    return (
      <Grid size="grow">
        <Alert severity="error" variant="outlined">
          <Typography>{String(items)}</Typography>
        </Alert>
      </Grid>
    );
  }

  if (items.length === 0) {
    return (
      <Grid size="grow">
        <Alert severity="info">
          <Typography>{`No registered project`}</Typography>
          <StyledLink to={"/projects/create"}>{`create one`}</StyledLink>
        </Alert>
      </Grid>
    );
  }

  return (
    <Fragment>
      <Grid size={{ md: 3 }}>
        <Paper variant="outlined">
          <StyledLink to="/projects/create">Create</StyledLink>
        </Paper>
      </Grid>
      <Grid size={{ md: "grow" }}>
        <Stack spacing={1}>
          {items.map((project, index) => (
            <ProjectCard
              dense={dense}
              key={`project-entry[${index}]`}
              project={project}
            />
          ))}
        </Stack>
      </Grid>
    </Fragment>
  );
});

type Props = { dense?: boolean; fetcher: Promise<Array<Project> | unknown> };
export const ProjectList: FC<Props> = memo(({ dense, fetcher }) => {
  return (
    <Grid container spacing={1}>
      <Suspense
        fallback={
          <Fragment>
            <Grid size={{ md: 3 }}>
              <Paper variant="outlined">
                <Stack spacing={1}>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </Stack>
              </Paper>
            </Grid>
            <Grid size="grow">
              <Stack spacing={1}>
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
              </Stack>
            </Grid>
          </Fragment>
        }
      >
        <Inner dense={dense} fetcher={fetcher} />
      </Suspense>
    </Grid>
  );
});
