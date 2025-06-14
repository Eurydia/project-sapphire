import type { Project } from "@/types/projects/project.entity";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import moment from "moment";
import { useMemo, type FC } from "react";
import { StyledLink } from "./StyledLink";

type Props = {
  project: Project;
};
export const ProjectCard: FC<Props> = ({ project }) => {
  const createdAtMsg = useMemo(() => {
    const date = moment(project.createdAt).fromNow();
    return `Created ${date}`;
  }, [project.createdAt]);

  const modifiedAtMsg = useMemo(() => {
    const date = moment(project.modifiedAt).fromNow();
    return `Modified ${date}`;
  }, [project.modifiedAt]);

  return (
    <Paper variant="outlined" sx={{ padding: 2 }}>
      <Toolbar
        disableGutters
        variant="dense"
        sx={{
          gap: 2,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          divider={<Divider flexItem variant="middle" orientation="vertical" />}
        >
          <Typography variant="subtitle2" color="textSecondary">
            {modifiedAtMsg}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {createdAtMsg}
          </Typography>
        </Stack>
        <Typography variant="subtitle2" color="textSecondary">
          {project.id}
        </Typography>
      </Toolbar>
      <Stack spacing={2}>
        <Typography
          variant="h4"
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
        {project.description !== undefined && (
          <Typography>{project.description}</Typography>
        )}
      </Stack>
      <List
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
        }}
        disablePadding
        subheader={
          <ListSubheader disableGutters disableSticky>
            Technologies:
          </ListSubheader>
        }
      >
        {project.technologies.length === 0 && (
          <ListItem sx={{ width: "fit-content" }}>
            <ListItemText
              slotProps={{
                primary: { variant: "subtitle2", color: "textSecondary" },
              }}
            >
              None
            </ListItemText>
          </ListItem>
        )}
        {project.technologies.map(({ id, name }) => {
          return (
            <ListItem
              key={`tech-${id}`}
              sx={{
                width: "fit-content",
              }}
            >
              <ListItemText>
                <StyledLink
                  to="/projects"
                  search={{ technologies: [name] }}
                  variant="subtitle2"
                  color="textSecondary"
                >
                  {`${name}`}
                </StyledLink>
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
      <List
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
        disablePadding
        subheader={
          <ListSubheader
            disableGutters
            disableSticky
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Topics:
          </ListSubheader>
        }
      >
        {project.topics.length === 0 && (
          <ListItem sx={{ width: "fit-content" }}>
            <ListItemText
              slotProps={{
                primary: { variant: "subtitle2", color: "textSecondary" },
              }}
            >
              None
            </ListItemText>
          </ListItem>
        )}
        {project.topics.map(({ id, name }) => {
          return (
            <ListItem
              key={`topic-${id}`}
              sx={{
                width: "fit-content",
              }}
            >
              <ListItemText>
                <StyledLink
                  variant="subtitle2"
                  color="textSecondary"
                  to="/projects"
                  search={{ topics: [name] }}
                >
                  {`${name}`}
                </StyledLink>
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
