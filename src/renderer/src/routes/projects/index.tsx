import { Stack } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import type { Either } from "fp-ts/lib/Either"
import type { FC } from "react"
import { memo } from "react"
import { ProjectList } from "~/components/data-display/project-list"
import type { ProjectWithMetadata } from "~/db/models/project/project"
import { listProjects } from "~/db/projects"
import { useLoggerStore } from "~/stores/useLoggerStore"

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()

  return (
    <Stack spacing={1}>
      <ProjectList fetcher={projects} />
    </Stack>
  )
})

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  loader: async (ctx) => {
    const { logNotice } = useLoggerStore.getState()
    const projects = new Promise<
      Either<Error, ProjectWithMetadata[]>
    >((resolve, reject) => {
      logNotice(`fetching projects for '${ctx.route.fullPath}'`)
      listProjects().then(resolve).catch(reject)
    })
    return {
      projects,
    }
  },
})
