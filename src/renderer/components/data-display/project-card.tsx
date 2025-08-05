import { FileSystemService } from "@/api/file-system.service"
import { ProjectService } from "@/api/project.service"
import { useLoggerStore } from "@/stores/useLoggerStore"
import { Divider, Paper, Stack, Typography } from "@mui/material"
import { useRouter } from "@tanstack/react-router"
import type { FC } from "react"
import { memo, useCallback } from "react"
import { toast } from "react-toastify"
import type { Project } from "src/shared/models/project/project"
import { TypographyButton } from "../input/typography-button"
import { StyledLink } from "../navigation/styled-link"
import { ProjectCardMetadata } from "./project-card-metadata"
import { ProjectCardTagList } from "./project-card-tag-list"

type Props = {
  project: Project
}
export const ProjectCard: FC<Props> = memo(({ project }) => {
  const { logWarn, logNotice } = useLoggerStore()
  const router = useRouter()

  const handleUnpin = useCallback(() => {
    logNotice(`unpinning project {uuid: ${project.uuid}}`)
    ProjectService.unpin(project.uuid).then(
      () => {
        logNotice(`Project ${project} is no longer pinned`)
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
  }, [project, logNotice, logWarn, router])

  const handlePin = useCallback(() => {
    logNotice(`pinning project {uuid: ${project.uuid}}`)
    ProjectService.pin(project.uuid).then(
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
  }, [project, logNotice, logWarn, router])

  const handleTogglePin = useCallback(() => {
    if (project.pinned) {
      handleUnpin()
    } else {
      handlePin()
    }
  }, [project.pinned, logNotice, logWarn])

  const handleOpenRoot = useCallback(() => {
    logNotice(`opening root for project ${project.uuid}`)
    FileSystemService.openPath(project.root.path).then(
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
      <Stack spacing={2} divider={<Divider flexItem />}>
        <Stack spacing={2} direction="row">
          <TypographyButton onClick={handleTogglePin}>
            {project.pinned ? `[UNPIN]` : `[PIN]`}
          </TypographyButton>
          <TypographyButton onClick={handleOpenRoot}>
            {`[OPEN IN EXPLORER]`}
          </TypographyButton>
        </Stack>
        <Stack spacing={2} component="div">
          <Stack>
            <Typography
              variant="subtitle2"
              color="textSecondary"
            >
              {project.uuid}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
            >
              {project.root.path}
            </Typography>
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
              <Typography>{project.description}</Typography>
            )}
          </Stack>
          <ProjectCardMetadata project={project} />
          <ProjectCardTagList items={project.tags} />
        </Stack>
      </Stack>
    </Paper>
  )
})
