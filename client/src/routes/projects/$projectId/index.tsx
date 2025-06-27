import { ProjectTreeService } from "@/services/project-tree.service";
import { ProjectService } from "@/services/projects.service";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { type FC } from "react";

const RouteComponent: FC = () => {
  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid size={{ md: 3 }}></Grid>
      <Grid size={{ md: 9 }} sx={{ overflowY: "auto", maxHeight: "50vh" }}>
        <Stack spacing={2}>
          <Paper variant="outlined">
            <Typography>Pinned notes</Typography>
          </Paper>
          <Paper variant="outlined">
            <Typography>Directory tree</Typography>
          </Paper>
          <Paper variant="outlined">
            <Typography>Read me</Typography>
          </Paper>
          <Paper variant="outlined">
            <Typography>Metadata</Typography>
          </Paper>
        </Stack>
        {/* <Paper variant="outlined" sx={{ padding: 2 }}>
          {data.readme !== undefined && (
            <Stack spacing={1} divider={<Divider flexItem variant="middle" />}>
              <List dense disablePadding>
                <ListItem>
                  <ListItemText
                    secondary={data.readme.name}
                    primary="File name"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Path" secondary={data.readme.path} />
                </ListItem>
              </List>
              <Markdown content={data.readme.content} />
            </Stack>
          )}
          {data.readme === undefined && <Typography>Unset</Typography>}
           <Markdown content={project.description ?? ''} /> 
        </Paper> */}
      </Grid>
    </Grid>
  );
};

export const Route = createFileRoute("/projects/$projectId/")({
  component: RouteComponent,
  loader: async (ctx) => {
    const project = await ProjectService.find(ctx.params.projectId);
    if (project === null) {
      throw notFound();
    }
    const tree = await ProjectTreeService.getTree(project.id);

    return {
      project,
      tree,
    };
  },
});
