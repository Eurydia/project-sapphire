import { Grid } from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { Suspense, memo } from 'react'
import type { FC } from 'react'
import { getProject } from '@/db/services/project.services'
import { ProjectDetails } from '@/components/data-display/project-details/project-details'

export const RouteComponent: FC = memo(() => {
  const { project } = Route.useLoaderData()
  return (
    <Grid container spacing={1}>
      <Grid size={{ md: 2 }}>
        <Suspense>
          <ProjectDetails project={project} />
        </Suspense>
      </Grid>
    </Grid>
  )
})

export const Route = createFileRoute('/projects/$uuid/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const project = await getProject(params.uuid)
    if (project === null) {
      throw notFound()
    }
    return {
      project,
    }
  },
})
