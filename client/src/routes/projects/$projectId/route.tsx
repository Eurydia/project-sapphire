import {
  generateFakeProjectDirectory,
  getProject,
} from '@/services/projects/api'
import { Box } from '@mui/material'
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { Fragment, type FC } from 'react'

const RouteComponent: FC = () => {
  return (
    <Fragment>
      <Box
        marginX={4}
        marginY={8}
        sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}
      >
        <Outlet />
      </Box>
    </Fragment>
  )
}

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,

  loader: (ctx) => {
    // const segments = ctx.location.pathname.split('/').filter(Boolean).slice(2)
    const project = getProject(ctx.params.projectId)
    if (project === null) {
      throw notFound()
    }
    return {
      // path: segments.map((segment, idx) => ({
      //   label: idx === 0 ? project.name : segment,
      //   path: [
      //     'projects',
      //     ctx.params.projectId,
      //     'tree',
      //     ...segments.slice(0, idx + 1),
      //   ].join('/'),
      // })),
      data: generateFakeProjectDirectory(ctx.params.projectId),
      project,
    }
  },
})
