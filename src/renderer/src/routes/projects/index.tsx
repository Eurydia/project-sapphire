import { Stack } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import type { FC } from "react"
import { memo } from "react"
import { ProjectList } from "~/components/data-display/project-list"
import { listProjects } from "~/db/projects"
import {
  LogLevel,
  useLoggerStore,
} from "~/stores/useLoggerStore"

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
  loader: async () => {
    const { beforePromise } = useLoggerStore.getState()

    return {
      projects: beforePromise(
        listProjects(),
        "fetching projects",
        {
          level: LogLevel.notice,
        },
      ),
    }
  },
})
