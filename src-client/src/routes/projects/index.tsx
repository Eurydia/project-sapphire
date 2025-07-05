import { createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'
import type { FC } from 'react'
import { fetchProjectAll } from '@/api/projects'
import { ProjectList } from '@/components/data-display/project-list/project-list'

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()

  return <ProjectList fetcher={projects} />
})

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  loader: () => {
    return { projects: fetchProjectAll() }
  },
})
