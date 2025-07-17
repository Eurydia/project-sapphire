import { Alert, Grid, Paper, Stack, Typography } from "@mui/material";
import type { FC } from "react";
import { memo } from "react";
import { ProjectCard } from "~/components/data-display/project-card";
import { StyledLink } from "~/components/navigation/styled-link";
import type { ProjectWithRootMetadata } from "~/models/project/project";
import { ProjectTableShape } from "../project-table-shape";

type Props = {
  dense?: boolean;
  items: Array<ProjectWithRootMetadata> | null;
};
export const ProjectList: FC<Props> = memo(({ dense, items }) => {
  if (items === null) {
    return (
      <Grid size="grow">
        <Alert severity="error" variant="outlined">
          <Typography>{`error`}</Typography>
        </Alert>
      </Grid>
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid size={{ md: 3 }}>
        <Stack spacing={1}>
          <Paper variant="outlined">
            <StyledLink to="/projects/create">Create</StyledLink>
          </Paper>
          <Paper variant="outlined">
            <ProjectTableShape />
          </Paper>
        </Stack>
      </Grid>
      {items.length === 0 && (
        <Grid size="grow">
          <Alert severity="info">
            <Typography>{`No project to display`}</Typography>
            <StyledLink to={"/projects/create"}>{`create one`}</StyledLink>
          </Alert>
        </Grid>
      )}
      {items.length > 0 && (
        <Grid size="grow">
          <Stack spacing={1}>
            {items.map((item, index) => (
              <ProjectCard
                dense={dense}
                key={`project-entry[${index}]`}
                project={item}
              />
            ))}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
});
