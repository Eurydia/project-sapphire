import type { Project } from "@/types/projects/project.entity";
import {
  CodeRounded,
  LocalOfferOutlined,
  UnfoldLessRounded,
  UnfoldMoreRounded,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  List,
  ListSubheader,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useCallback, useMemo, useState, type FC } from "react";
import { Markdown } from "./Markdown";
import { StyledLink } from "./StyledLink";

type Props = {
  project: Project;
};
export const ProjectCard: FC<Props> = ({ project }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollaspeToggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const createdAtMsg = useMemo(() => {
    return moment(project.createdAt).fromNow();
  }, [project.createdAt]);

  const modifiedAtMsg = useMemo(() => {
    const modified = moment(project.modifiedAt).fromNow();
    return `Updated ${modified}`;
  }, [project.modifiedAt]);

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <StyledLink
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            sx={{
              display: "block",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {project.name}
          </StyledLink>
        }
        action={
          <IconButton onClick={handleCollaspeToggle}>
            {collapsed && <UnfoldMoreRounded />}
            {!collapsed && <UnfoldLessRounded />}
          </IconButton>
        }
      />
      {project.description !== undefined && (
        <CardContent>
          <Markdown content={project.description} />
        </CardContent>
      )}
      <Collapse in={!collapsed}>
        <Divider flexItem variant="middle" />
        <CardContent>
          <Typography>{modifiedAtMsg}</Typography>
          <List
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
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
                <CodeRounded />
              </ListSubheader>
            }
          >
            {/* {item.tags.technologies.map((tech) => {
              return (
                <ListItem
                  key={`tech-${tech}`}
                  sx={{
                    width: "fit-content",
                  }}
                >
                  <ListItemText>
                    <StyledLink to="." search={{ technologies: [tech] }}>
                      {`${tech}`}
                    </StyledLink>
                  </ListItemText>
                </ListItem>
              );
            })} */}
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
                <LocalOfferOutlined />
              </ListSubheader>
            }
          >
            {/* {item.tags.topics.length === 0 && (
              <ListItem sx={{ width: "fit-content" }}>
                <ListItemText>No topic</ListItemText>
              </ListItem>
            )}
            {item.tags.topics.map((topics) => {
              return (
                <ListItem
                  key={`topic-${topics}`}
                  sx={{
                    width: "fit-content",
                  }}
                >
                  <ListItemText>
                    <StyledLink to="." search={{ technologies: [topics] }}>
                      {`${topics}`}
                    </StyledLink>
                  </ListItemText>
                </ListItem>
              );
            })} */}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  );
};
