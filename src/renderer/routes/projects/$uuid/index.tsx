import { ProjectTreeService } from "@/api/project-tree.service"
import { ProjectService } from "@/api/project.service"
import { ProjectCardMetadata } from "@/components/data-display/project-card-metadata"
import { ProjectCardTagList } from "@/components/data-display/project-card-tag-list"
import { ProjectTreeExplorer } from "@/components/data-display/project-tree-explorer"
import { Grid, Paper, Stack, Typography } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import type { FC } from "react"
import { memo } from "react"

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
            <ProjectCardTagList items={project.tags} />
            <ProjectCardMetadata project={project} />
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ md: "grow" }}>
        <Paper variant="outlined">
          <ProjectTreeExplorer tree={tree} />
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
    const tree = await ProjectTreeService.getRootTree(
      project.uuid,
    )
    return { project, tree }
  },
})
