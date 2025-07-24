import {
  EditRounded,
  FolderRounded,
  PushPin,
  PushPinOutlined,
} from "@mui/icons-material"
import {
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useRouter } from "@tanstack/react-router"
import type { FC } from "react"
import { Fragment, memo, useCallback } from "react"
import { toast } from "react-toastify"
import { openPath } from "~/api/fs"
import { StyledLink } from "~/components/navigation/styled-link"
import type { ProjectWithMetadata } from "~/db/models/project/project"
import { pinProject, unpinProject } from "~/db/projects"
import { useLoggerStore } from "~/stores/useLoggerStore"
import { ProjectCardMetadata } from "./project-card-metadata"
import { ProjectCardTechList } from "./project-card-tech-list"
import { ProjectCardTopicList } from "./project-card-topic-list"

type Props = {
  project: ProjectWithMetadata
}
export const ProjectCard: FC<Props> = memo(({ project }) => {
  const {
    typography: { monospaceFontFamily, serifFontFamily },
    breakpoints,
  } = useTheme()
  const isSmallScreen = useMediaQuery(breakpoints.down("md"))
  const { logWarn, logNotice } = useLoggerStore()
  const router = useRouter()

  const handleTogglePin = useCallback(() => {
    if (project.pinned === 0) {
      logNotice(`unpinning project {uuid: ${project.uuid}}`)
      unpinProject(project.uuid).then(
        () => {
          logNotice(
            `project {uuid: ${project.uuid}} is no longer pinned`,
          )
          toast.success("project is no longer pinned")
          router.invalidate()
        },
        (err) => {
          logWarn(
            `failed to unpin project {uuid: ${project.uuid}}; ${err}`,
          )
          toast.warn("failed to unpin project")
        },
      )
    } else {
      logNotice(`pinning project {uuid: ${project.uuid}}`)
      pinProject(project.uuid).then(
        () => {
          logNotice(
            `project {uuid: ${project.uuid}} is now pinned`,
          )
          toast.success("project is now pinned")
          router.invalidate()
        },
        (err) => {
          logWarn(
            `failed to pin project {uuid: ${project.uuid}}; ${err}`,
          )
          toast.warn("failed to pin project")
        },
      )
    }
  }, [project.pinned, project.uuid, router, logNotice, logWarn])

  const handleOpenRoot = useCallback(() => {
    logNotice(`opening root for project ${project.uuid}`)
    openPath(project.root).then(
      () => {
        logNotice(`opened project root`)
        toast.success("opened in system explorer")
      },
      (err) => {
        logWarn(`failed to open project root: ${err}`)
        toast.warn("failed to open root")
      },
    )
  }, [project.root, project.uuid, logWarn, logNotice])

  return (
    <Paper variant="outlined">
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        spacing={2}
        divider={
          <Divider
            flexItem
            orientation={
              isSmallScreen ? "horizontal" : "vertical"
            }
          />
        }
      >
        <Stack
          spacing={3}
          flexBasis={0}
          flexGrow={1}
          component="div"
        >
          <Stack>
            <Fragment>
              <Typography
                fontFamily={monospaceFontFamily}
                variant="subtitle2"
                color="textSecondary"
              >
                {project.uuid}
              </Typography>
              <Typography
                fontFamily={monospaceFontFamily}
                variant="subtitle2"
                color="textSecondary"
              >
                {project.root}
              </Typography>
            </Fragment>
          </Stack>
          <Stack>
            <Typography
              fontFamily={serifFontFamily}
              variant="h4"
              component="div"
              sx={{
                width: "fit-content",
                textWrap: "pretty",
                wordBreak: "break-all",
              }}
            >
              <StyledLink
                to={"/projects/$uuid/edit"}
                params={{ uuid: project.uuid }}
              >
                {project.name}
              </StyledLink>
            </Typography>
            {project.description !== "" && (
              <Typography fontFamily={serifFontFamily}>
                {project.description}
              </Typography>
            )}
          </Stack>
          <ProjectCardMetadata project={project} />
          <Stack spacing={0.5}>
            <ProjectCardTechList techUuids={project.techUuids} />
            <ProjectCardTopicList
              topicUuids={project.topicUuids}
            />
          </Stack>
        </Stack>
        <Stack
          spacing={2}
          flexBasis={0}
          flexGrow={0}
          direction={{ xs: "row", md: "column" }}
        >
          <IconButton onClick={handleTogglePin}>
            {project.pinned === 0 ? (
              <PushPin />
            ) : (
              <PushPinOutlined />
            )}
          </IconButton>
          <IconButton
            onClick={() =>
              router.navigate({
                to: "/projects/$uuid/edit",
                params: { uuid: project.uuid },
              })
            }
          >
            <EditRounded />
          </IconButton>
          <IconButton onClick={handleOpenRoot}>
            <FolderRounded />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  )
})
