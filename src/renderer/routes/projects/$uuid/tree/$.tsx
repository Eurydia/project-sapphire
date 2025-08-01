import { ProjectTreeExplorer } from "@/components/data-display/project-tree-explorer"
import { Paper, Stack, Typography } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import { type FC, memo } from "react"

const RouteComponent: FC = memo(() => {
  const { tree } = Route.useLoaderData()

  return (
    <Stack spacing={1}>
      <Paper>
        {tree !== null && <ProjectTreeExplorer tree={tree} />}
      </Paper>
      <Paper>
        <Typography>{tree.readme?.content}</Typography>
      </Paper>
    </Stack>
  )
})

export const Route = createFileRoute("/projects/$uuid/tree/$")({
  component: RouteComponent,
  loader: async ({ params: { uuid, _splat } }) => {
    const project = await getProjectByUuid(uuid)
    if (project === undefined) {
      throw notFound()
    }

    const tree = await getProjectTree(project, _splat ?? "")
    return { tree, project }
  },
})
