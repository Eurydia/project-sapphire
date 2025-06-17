import type { Project } from "@/types/projects/project.entity";
import {
  UnfoldLessRounded,
  UnfoldMoreRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import { Collapse, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import moment from "moment";
import { useMemo, useState, type FC } from "react";
import { toast } from "react-toastify";
import { ProjectCardTechnologyList } from "./ProjectCardTechologyList";
import { ProjectCardTopicList } from "./ProjectCardTopicList";

type Props = {
  project: Project;
};
export const ProjectCard: FC<Props> = ({ project }) => {
  const [expandActive, setExpandActive] = useState(false);
  const createdAtMsg = useMemo(() => {
    let date = "unknown";
    if (project.metadata !== null) {
      date = moment(project.metadata.ctime).fromNow();
    }
    return `Created ${date}`;
  }, [project.metadata]);

  const modifiedAtMsg = useMemo(() => {
    let date = "unknown";
    if (project.metadata !== null) {
      date = moment(project.metadata.mtime).fromNow();
    }
    return `Modified ${date}`;
  }, [project.metadata]);

  const accessedAtMsg = useMemo(() => {
    let date = "unknown";
    if (project.metadata !== null) {
      date = moment(project.metadata.atime).fromNow();
    }
    return `Accessed ${date}`;
  }, [project.metadata]);

  return (
    <Paper variant="outlined" sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="baseline"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            <Link to="/projects/$projectId" params={{ projectId: project.id }}>
              {project.name}
            </Link>
          </Typography>

          <Stack
            spacing={1}
            direction="row"
            flexWrap="wrap"
            alignItems="center"
          >
            <IconButton
              disableRipple
              onClick={() => setExpandActive((prev) => !prev)}
            >
              {expandActive && (
                <UnfoldLessRounded sx={{ transform: "rotate(45deg)" }} />
              )}
              {!expandActive && (
                <UnfoldMoreRounded sx={{ transform: "rotate(45deg)" }} />
              )}
            </IconButton>
          </Stack>
        </Stack>

        {project.description !== null && (
          <Typography component="div">{project.description}</Typography>
        )}

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Typography color="textSecondary">{project.id}</Typography>
          {project.metadata === null && (
            <Stack spacing={1} alignItems="center" direction="row">
              <WarningAmberRounded color="warning" />
              <Typography color="warning" fontWeight={900}>
                {`Invalid root path`}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Collapse in={expandActive}>
          <Stack spacing={2}>
            <ProjectCardTechnologyList items={project.technologies} />
            <ProjectCardTopicList items={project.topics} />
            <Typography
              color="textSecondary"
              component="div"
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "baseline",
              }}
            >
              {`Location:`}
              <Stack spacing={2} alignItems="center" direction="row">
                <Typography
                  sx={{
                    cursor: "pointer",
                    gap: 1,
                    textDecorationLine: "underline",
                    "&:hover": { color: "primary.main" },
                  }}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(project.absPath)
                      .then(() => toast.success("Copied to clipboard"))
                      .catch(() => toast.error("Failed to copy"));
                  }}
                >
                  {project.absPath}
                </Typography>
                {project.metadata === null && (
                  <WarningAmberRounded color="warning" />
                )}
              </Stack>
            </Typography>

            <Stack
              direction="row"
              spacing={4}
              divider={
                <Typography color="textSecondary" sx={{ userSelect: "none" }}>
                  {`/`}
                </Typography>
              }
            >
              <Typography color="textSecondary">{modifiedAtMsg}</Typography>
              <Typography color="textSecondary">{accessedAtMsg}</Typography>
              <Typography color="textSecondary">{createdAtMsg}</Typography>
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
};
