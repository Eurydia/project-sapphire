import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import type { FC } from "react"
import { memo } from "react"
import { ProjectList } from "~/components/data-display/project-list"
import { projectQuerySchema } from "~/db/models/project/dto/project-dto"
import { listProjects } from "~/db/projects"

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()
  return <ProjectList fetcher={projects} />
})

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  validateSearch: zodValidator(projectQuerySchema.optional()),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    return {
      projects: await listProjects(search).catch((err) => {
        console.debug(err)
        return []
      }),
    }
  },
})
