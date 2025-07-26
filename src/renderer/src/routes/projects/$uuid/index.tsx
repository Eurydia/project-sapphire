import { Grid, Paper, Stack, Typography } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import type { FC } from "react"
import { memo } from "react"
import { readDir } from "~/api/fs"
import { ProjectCardGroupList } from "~/components/data-display/project-card-group-list"
import { ProjectCardMetadata } from "~/components/data-display/project-card-metadata"
import { ProjectCardTechList } from "~/components/data-display/project-card-tech-list"
import { ProjectCardTopicList } from "~/components/data-display/project-card-topic-list"
import { ProjectTreeExplorer } from "~/components/data-display/project-tree-explorer"
import { getProjectByUuid } from "~/db/projects"

export const RouteComponent: FC = memo(() => {
  const { project, tree } = Route.useLoaderData()

  return (
    <Grid container spacing={1} maxWidth="lg" marginX="auto">
      <Grid size={{ md: 4 }}>
        <Paper variant="outlined">
          <Stack>
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
            <ProjectCardGroupList items={project.tags.groups} />
            <ProjectCardTechList
              items={project.tags.technologies}
            />
            <ProjectCardTopicList items={project.tags.topics} />
            <ProjectCardMetadata project={project} />
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ md: "grow" }}>
        <Paper variant="outlined">
          {tree !== null && (
            <ProjectTreeExplorer {...tree} project={project} />
          )}
        </Paper>
      </Grid>
    </Grid>
  )
})

export const Route = createFileRoute("/projects/$uuid/")({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    const project = await getProjectByUuid(uuid)
    if (project === undefined) {
      throw notFound()
    }
    const tree = await readDir(project.root.path)
    return { project, tree }
  },
})
