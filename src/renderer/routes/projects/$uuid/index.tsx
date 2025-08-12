import { FileSystemService } from "@/api/file-system.service"
import { ProjectService } from "@/api/project.service"
import { ProjectCardMetadata } from "@/components/data-display/project-card-metadata"
import { ProjectCardTagList } from "@/components/data-display/project-card-tag-list"
import { TypographyButton } from "@/components/input/typography-button"
import { StyledLink } from "@/components/navigation/styled-link"
import {
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import { isLeft } from "fp-ts/lib/Either"
import type { FC } from "react"
import { memo } from "react"

export const RouteComponent: FC = memo(() => {
  const { project } = Route.useLoaderData()

  return (
    <Grid container spacing={1} maxWidth="md" marginX="auto">
      <Grid size={{ md: 12 }}>
        <Paper variant="outlined">
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TypographyButton
                onClick={() => {
                  if (project.pinned) {
                    ProjectService.unpin(project.uuid)
                  } else {
                    ProjectService.pin(project.uuid)
                  }
                }}
              >
                {project.pinned ? "[UNPIN]" : "[PIN]"}
              </TypographyButton>
              <StyledLink
                to="/projects/$uuid/edit"
                params={{ uuid: project.uuid }}
              >
                {`[EDIT]`}
              </StyledLink>
              <TypographyButton
                onClick={() =>
                  FileSystemService.openPath(project.root.path)
                }
              >
                {`[OPEN IN EXPLORER]`}
              </TypographyButton>
            </Stack>
            <Divider flexItem />
            <Typography variant="h3">{project.name}</Typography>
            <Typography
              fontStyle={
                project.description === undefined
                  ? "italic"
                  : "normal"
              }
            >
              {project.description}
            </Typography>
            <ProjectCardMetadata project={project} />
            <ProjectCardTagList project={project} />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  )
})

export const Route = createFileRoute("/projects/$uuid/")({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    const result = await ProjectService.findByUuid(uuid)
    if (isLeft(result)) {
      throw notFound()
    }
    return { project: result.right }
  },
})
