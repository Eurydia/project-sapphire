import type { Project } from "@/types/projects/project.entity";
import { Paper, Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { type FC } from "react";

type Props = {
  project: Project;
};
export const ProjectCard: FC<Props> = ({ project }) => {
  return (
    <Paper variant="outlined" sx={{ padding: 2 }}>
      <Stack spacing={2} direction="column" useFlexGap>
        <Typography
          variant="h5"
          component="div"
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Link to="/projects/$projectId" params={{ projectId: project.id }}>
            {project.name}
          </Link>
        </Typography>
        {project.description !== null && (
          <Typography component="div">{project.description}</Typography>
        )}
      </Stack>
    </Paper>
  );
};
