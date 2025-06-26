import { ProjectTreeService } from "@/services/project-tree.service";
import { ProjectService } from "@/services/projects.service";
import { SyncRounded } from "@mui/icons-material";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@mui/material";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { type FC } from "react";

const RouteComponent: FC = () => {
  const router = useRouter();
  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 9 }}>
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
      <Grid size={{ md: 3 }}>
        <Paper variant="outlined" sx={{ padding: 1 }}>
          <List dense disablePadding>
            <ListItem>
              {/* <ListItemText primary={project.description} /> */}
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Synced"
                // secondary={moment(data.lastSynchronized).fromNow()}
              />
              <ListItemAvatar>
                <Button
                  disableFocusRipple
                  variant="outlined"
                  disableElevation
                  onClick={() => {
                    router.invalidate({ sync: true });
                  }}
                >
                  <SyncRounded fontSize="small" />
                </Button>
              </ListItemAvatar>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Modified"
                // secondary={moment(project.modifiedAt).fromNow()}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Created"
                // secondary={moment(project.createdAt).fromNow()}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Technologies"
                // secondary={project.tags.technologies.join(", ")}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Topics"
                // secondary={project.tags.topics.join(", ")}
              />
            </ListItem>
          </List>
        </Paper>
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
