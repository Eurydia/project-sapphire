import { Paper } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import { memo, type FC } from "react"
import { ProjectTreeExplorer } from "~/components/data-display/project-tree-explorer"
import { getProjectTree } from "~/db/project-trees"
import { getProjectByUuid } from "~/db/projects"

const RouteComponent: FC = memo(() => {
  const { tree } = Route.useLoaderData()

  return (
    <Paper>
      {tree !== null && <ProjectTreeExplorer tree={tree} />}
    </Paper>
  )
})

export const Route = createFileRoute("/projects/$uuid/tree/")({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    const project = await getProjectByUuid(uuid)
    if (project === undefined) {
      throw notFound()
    }

    const tree = await getProjectTree(project, "")
    return { tree, project }
  },
})
