import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { isLeft } from "fp-ts/lib/Either"
import type { FC } from "react"
import { memo } from "react"
import { ProjectList } from "~/components/data-display/project-list"
import { projectQuerySchema } from "~/db/models/project/dto/project-dto"
import { listProjects } from "~/db/projects"
import { useLoggerStore } from "~/stores/useLoggerStore"

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()
  return <ProjectList fetcher={projects} />
})

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  validateSearch: zodValidator(projectQuerySchema.optional()),
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ deps: { search }, location: { pathname } }) => {
    const { logNotice, logWarn } = useLoggerStore.getState()
    logNotice(JSON.stringify(search))
    const projects = new Promise<
      Awaited<ReturnType<typeof listProjects>>
    >((resolve) => {
      logNotice(
        `prepared ${listProjects.name} promise for ${pathname}`,
      )
      listProjects(search).then((result) => {
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
