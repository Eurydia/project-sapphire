import { Stack } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, memo, use } from 'react'
import type { FC } from 'react'
import { fetchProject } from '@/api/projects'
import { ProjectMetadata } from '@/components/data-display/project-details/project-metadata'

export const RouteComponent: FC = memo(() => {
  const { project: fetcher } = Route.useLoaderData()
  return (
    <Stack spacing={1}>
      <Suspense>
        <ProjectMetadata fetcher={fetcher} />
      </Suspense>
    </Stack>
  )
})

export const Route = createFileRoute('/projects/$uuid/')({
  component: RouteComponent,
  loader: ({ params }) => {
    return { project: fetchProject(params.uuid) }
  },
})
