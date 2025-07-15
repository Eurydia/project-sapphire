import { Box, Stack, TextField } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import type { FC } from "react";
import { memo } from "react";
import { listProject, withRootMetadata } from "~/api/db/projects";
import { ProjectList } from "~/components/data-display/project-list/project-list";

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData();

  return (
    <Box padding={2} maxWidth="lg" marginX="auto">
      <Stack spacing={1}>
        <TextField fullWidth size="small" />
        <ProjectList dense fetcher={projects} />
      </Stack>
    </Box>
  );
});

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  loader: () => {
    return {
      projects: listProject()
        .then((resp) => {
          return Promise.all(resp.map((entry) => withRootMetadata(entry)));
        })
        .catch(() => null),
    };
  },
});
