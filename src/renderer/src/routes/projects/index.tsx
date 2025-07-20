import { Stack, TextField } from "@mui/material"
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
      <TextField fullWidth size="small" />
      <ProjectList dense items={projects} />
    </Stack>
  )
})

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  loader: async () => {
    const { beforePromise, logNotice } =
      useLoggerStore.getState()
    return {
      projects: await beforePromise(
        listProjects(),
        "fetching projects",
        { level: LogLevel.info },
      ).then((res) => {
        logNotice(`fetched ok with ${res.length} items`)
        return res
      }),
    }
  },
})
