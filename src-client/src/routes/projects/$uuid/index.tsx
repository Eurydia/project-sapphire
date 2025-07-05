import { Grid } from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { Suspense, memo } from 'react'
import type { FC } from 'react'
import type { Project } from '@/models/project/project'
import { existsProject, fetchProject } from '@/api/projects'
import { ProjectDetails } from '@/components/data-display/project-details/project-details'

export const RouteComponent: FC = memo(() => {
  const { project: fetcher } = Route.useLoaderData()
  return (
    <Grid container spacing={1}>
      <Grid size={{ md: 2 }}>
        <Suspense>
          <ProjectDetails fetcher={fetcher} />
        </Suspense>
      </Grid>
    </Grid>
  )
})

export const Route = createFileRoute('/projects/$uuid/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const exists = await existsProject(params.uuid)
    if (!exists) {
      throw notFound()
    }

    return {
      project: fetchProject(params.uuid) as Promise<Project>,
    }
  },
})
