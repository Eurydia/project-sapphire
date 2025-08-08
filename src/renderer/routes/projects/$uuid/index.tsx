import { ProjectService } from "@/api/project.service"
import { ProjectCardMetadata } from "@/components/data-display/project-card-metadata"
import { ProjectCardTagList } from "@/components/data-display/project-card-tag-list"
import { StyledLink } from "@/components/navigation/styled-link"
import { Grid, Paper, Stack, Typography } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import type { FC } from "react"
import { memo } from "react"

export const RouteComponent: FC = memo(() => {
  const { project } = Route.useLoaderData()

  return (
    <Grid container spacing={1} maxWidth="lg" marginX="auto">
      <Grid size={{ md: 4 }}>
        <Paper variant="outlined">
          <Stack>
            <Stack direction="row" spacing={0.5}>
              <StyledLink
                to="/projects/$uuid/edit"
                params={{ uuid: project.uuid }}
              >
                {`[EDIT]`}
              </StyledLink>
            </Stack>
            <Typography variant="subtitle1">
              {project.root.path}
            </Typography>
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
    const project = await ProjectService.findByUuid(uuid)
    if (project === null) {
      throw notFound()
    }
    return { project }
  },
})
