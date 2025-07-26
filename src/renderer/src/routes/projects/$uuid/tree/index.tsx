import { Paper } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import { memo, type FC } from "react"
import { readDir } from "~/api/fs"
import { ProjectTreeExplorer } from "~/components/data-display/project-tree-explorer"
import { getProjectByUuid } from "~/db/projects"

const RouteComponent: FC = memo(() => {
  const { project, tree } = Route.useLoaderData()

  return (
    <Paper>
      {tree !== null && (
        <ProjectTreeExplorer {...tree} project={project} />
      )}
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

    const tree = await readDir(project.root.path)
    return { tree, project }
  },
})
