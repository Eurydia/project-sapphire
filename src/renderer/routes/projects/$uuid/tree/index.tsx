import { ProjectTreeService } from "@/api/project-tree.service"
import { ProjectService } from "@/api/project.service"
import { ProjectTreeExplorer } from "@/components/data-display/project-tree-explorer"
import { Paper } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import { isLeft } from "fp-ts/lib/Either"
import { memo, type FC } from "react"

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
    const result = await ProjectService.findByUuid(uuid)
    if (isLeft(result)) {
      throw notFound()
    }

    const tree = await ProjectTreeService.getRootTree(uuid)
    return { tree, project: result.right }
  },
})
