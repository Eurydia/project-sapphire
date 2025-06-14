import { SyncRounded } from "@mui/icons-material";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { type FC } from "react";

const RouteComponent: FC = () => {
  // const { project } = Route.useLoaderData();
  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 9 }}>
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Name</TableCell>
                  <TableCell>Last updated</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {data.subdirectories.map(({ name, path, updatedAt }, index) => {
                  return (
                    <TableRow
                      key={`row-dir-${index}`}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <FolderRounded color="primary" fontSize="small" />
                      </TableCell>
                      <TableCell>
                        <StyledLink
                          to={`/projects/$projectId/tree/$`}
                          params={{
                            projectId: project.id,
                            _splat: path,
                          }}
                        >
                          {name}
                        </StyledLink>
                      </TableCell>
                      <TableCell>{moment(updatedAt).fromNow()}</TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <MoreVertRounded />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {data.files.map(({ name, path, updatedAt }, index) => {
                  return (
                    <TableRow
                      key={`row-file-${index}`}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell padding="checkbox" />
                      <TableCell>
                        <StyledLink
                          to="/projects/$projectId/blob/$"
                          params={{ projectId: project.id, _splat: path }}
                        >
                          {name}
                        </StyledLink>
                      </TableCell>
                      <TableCell>{moment(updatedAt).fromNow()}</TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <MoreVertRounded />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
                <Button disableFocusRipple variant="outlined" disableElevation>
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
      <Grid size={{ md: 12 }}>
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
  loader: (ctx) => {
    // const project = getProject(ctx.params.projectId)
    // if (project === null) {
    // }
    // const segments = ctx.location.pathname.split('/').filter(Boolean)
    // return {
    //   project,
    // }
  },
});
