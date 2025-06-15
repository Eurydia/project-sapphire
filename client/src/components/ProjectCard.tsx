import type { Project } from "@/types/projects/project.entity";
import {
  UnfoldLessRounded,
  UnfoldMoreRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import {
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
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
      date = moment(project.metadata.ctimeMs).fromNow();
    }
    return `Created ${date}`;
  }, [project.metadata]);

  const modifiedAtMsg = useMemo(() => {
    let date = "unknown";
    if (project.metadata !== null) {
      date = moment(project.metadata.mtimeMs).fromNow();
    }
    return `Modified ${date}`;
  }, [project.metadata]);

  const accessedAtMsg = useMemo(() => {
    let date = "unknown";
    if (project.metadata !== null) {
      date = moment(project.metadata.atimeMs).fromNow();
    }
    return `Accessed ${date}`;
  }, [project.metadata]);

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
        <Typography
          color="warning"
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            visibility: project.metadata !== null ? "hidden" : "visible",
          }}
        >
          <WarningAmberRounded color="warning" />
          {`Cannot find project root`}
        </Typography>
        <Typography color="textSecondary">{project.id}</Typography>
      </Toolbar>
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
          <Typography variant="h6" component="div">
            {project.description}
          </Typography>
        )}
      </Stack>
      <Collapse in={expandActive}>
        <Stack spacing={2} paddingTop={4}>
          <Divider flexItem variant="middle" />
          <Stack
            direction="row"
            spacing={4}
            divider={<Typography sx={{ userSelect: "none" }}>{`/`}</Typography>}
          >
            <Typography color="textSecondary">{modifiedAtMsg}</Typography>
            <Typography color="textSecondary">{accessedAtMsg}</Typography>
            <Typography color="textSecondary">{createdAtMsg}</Typography>
          </Stack>
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
          <ProjectCardTechnologyList items={project.technologies} />
          <ProjectCardTopicList items={project.topics} />
        </Stack>
      </Collapse>
    </Paper>
  );
};
