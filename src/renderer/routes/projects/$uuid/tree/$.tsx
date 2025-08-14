import { ProjectTreeService } from "@/api/project-tree.service"
import { ProjectService } from "@/api/project.service"
import { ProjectTreeExplorer } from "@/components/data-display/project-tree-explorer"
import { Paper, Stack } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import { isLeft } from "fp-ts/lib/Either"
import { type FC, memo } from "react"

const RouteComponent: FC = memo(() => {
  const { tree } = Route.useLoaderData()

  return (
    <Stack spacing={1}>
      <Paper>
        {tree !== null && <ProjectTreeExplorer tree={tree} />}
      </Paper>
    </Stack>
  )
})

export const Route = createFileRoute("/projects/$uuid/tree/$")({
  component: RouteComponent,
  loader: async ({ params: { uuid, _splat } }) => {
    const result = await ProjectService.findByUuid(uuid)
    if (isLeft(result)) {
      throw notFound()
    }

    const tree = await ProjectTreeService.getTree(
      result.right.uuid,
      _splat ?? "",
    )
    return { tree, project: result }
  },
})
