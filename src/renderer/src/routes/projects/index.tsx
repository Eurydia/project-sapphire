import { createFileRoute } from "@tanstack/react-router"
import type { FC } from "react"
import { memo } from "react"
import { ProjectList } from "~/components/data-display/project-list"
import { listProjects } from "~/db/projects"

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()
  return <ProjectList fetcher={projects} />
})

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  loader: () => {
    return { projects: listProjects() }
  },
})
