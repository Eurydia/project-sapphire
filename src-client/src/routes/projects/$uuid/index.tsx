import { Stack } from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { Suspense, memo, use } from 'react'
import type { FC } from 'react'
import { fetchProject, fetchProjectMetadata } from '@/api/projects'
import { ProjectMetadataDisplay } from '@/components/data-display/project-details/project-metadata-display'
import { ProjectDetails } from '@/components/data-display/project-details/project-details'

export const RouteComponent: FC = memo(() => {
  const { project: fetcher } = Route.useLoaderData()
  return (
    <Stack spacing={1}>
      <Suspense>
        <ProjectDetails fetcher={fetcher} />
      </Suspense>
    </Stack>
  )
})

export const Route = createFileRoute('/projects/$uuid/')({
  component: RouteComponent,
  loader: ({ params }) => {
    return {
      project: fetchProject(params.uuid).then((res) => {
        if (res === null) {
          throw notFound()
        }
        return res
      }),
    }
  },
})
