import { createFileRoute } from "@tanstack/react-router"
import { isLeft } from "fp-ts/lib/Either"
import type { FC } from "react"
import { memo } from "react"
import { ProjectList } from "~/components/data-display/project-list"
import { listProjects } from "~/db/projects"
import { useLoggerStore } from "~/stores/useLoggerStore"

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()
  return <ProjectList fetcher={projects} />
})

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  loader: ({ location: { pathname } }) => {
    const { logNotice, logWarn } = useLoggerStore.getState()
    const projects = new Promise<
      Awaited<ReturnType<typeof listProjects>>
    >((resolve) => {
      logNotice(
        `prepared ${listProjects.name} promise for ${pathname}`,
      )
      listProjects().then((result) => {
        if (isLeft(result)) {
          logWarn(
            `failed to resolve ${listProjects.name} promise: ${String(result.left)}`,
          )
        } else {
          logNotice(
            `resolved ${listProjects.name} promise sucess`,
          )
        }
        resolve(result)
      })
    })

    return { projects }
  },
})
