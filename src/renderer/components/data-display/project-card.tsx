import { ProjectService } from "@/api/project.service"
import { useLoggerStore } from "@/stores/useLoggerStore"
import { Divider, Paper, Stack, Typography } from "@mui/material"
import { useRouter } from "@tanstack/react-router"
import { isLeft } from "fp-ts/lib/Either"
import type { FC } from "react"
import { useCallback } from "react"
import type { Project } from "src/shared/models/project/project"
import { TypographyButton } from "../input/typography-button"
import { StyledLink } from "../navigation/styled-link"
import { ProjectCardTagList } from "./project-card-tag-list"

type Props = {
  project: Project
}
export const ProjectCard: FC<Props> = ({ project }) => {
  const { logWarn, logNotice } = useLoggerStore()
  const router = useRouter()

  const handleUnpin = useCallback(async () => {
    logNotice(`unpinning ${project.uuid}`)
    const result = await ProjectService.unpin(project.uuid)
    if (isLeft(result)) {
      logWarn(
        `failed to unpin project ${project.uuid} with error: ${result.left}`,
      )
    } else {
      logNotice(`${project.uuid} is no longer pinned`)
      await router.invalidate({ sync: true })
    }
  }, [project, logNotice, logWarn, router])

  const handlePin = useCallback(async () => {
    const result = await ProjectService.pin(project.uuid)
    if (isLeft(result)) {
      logWarn(
        `failed to pin project ${project.uuid} with error: ${result.left}`,
      )
    } else {
      logNotice(`${project.uuid} is now pinned`)
      await router.invalidate({ sync: true })
    }
  }, [project, logNotice, logWarn, router])

  const handleTogglePin = useCallback(() => {
    if (project.pinned) {
      handleUnpin()
    } else {
      handlePin()
    }
  }, [project.pinned, logNotice, logWarn])

  // const handleOpenRoot = useCallback(() => {
  //   logNotice(`opening root for project ${project.uuid}`)
  //   FileSystemService.openPath(project.root.path).then(
  //     () => {
  //       logNotice(`opened project root`)
  //       toast.success("opened in system explorer")
  //     },
  //     (err) => {
  //       logWarn(`failed to open project root: ${err}`)
  //       toast.warn("failed to open root")
  //     },
  //   )
  // }, [project.root, project.uuid, logWarn, logNotice])

  return (
    <Paper component="div">
      <Stack spacing={2} divider={<Divider flexItem />}>
        <Stack spacing={2} direction="row">
          <TypographyButton onClick={handleTogglePin}>
            {project.pinned ? `[UNPIN]` : `[PIN]`}
          </TypographyButton>
          <StyledLink
            to="/projects/$uuid/edit"
            params={{ uuid: project.uuid }}
          >
            {`[EDIT]`}
          </StyledLink>

          {/* <TypographyButton onClick={handleOpenRoot}>
            {`[OPEN IN EXPLORER]`}
          </TypographyButton>
           */}
        </Stack>
        <Stack spacing={2}>
          <Stack>
            <Typography
              variant="subtitle2"
              color="textSecondary"
            >
              {project.uuid}
            </Typography>
            {/* <Typography
              variant="subtitle2"
              color="textSecondary"
            >
              {project.root.path}
            </Typography> */}
          </Stack>
          <Stack>
            <Typography
              variant="h4"
              component="div"
              sx={{
                width: "fit-content",
                textWrap: "pretty",
                wordBreak: "break-all",
              }}
            >
              <StyledLink
                to={"/projects/$uuid"}
                params={{ uuid: project.uuid }}
              >
                {project.name}
              </StyledLink>
            </Typography>
            {project.description !== "" && (
              <Typography
                component="pre"
                sx={{
                  wordWrap: "normal",
                  whiteSpace: "normal",
                }}
              >
                {project.description}
              </Typography>
            )}
          </Stack>
          <ProjectCardTagList project={project} />
        </Stack>
      </Stack>
    </Paper>
  )
}
