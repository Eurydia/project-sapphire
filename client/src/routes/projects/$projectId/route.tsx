import { StyledLink } from '@/components/StyledLink'
import {
  generateFakeProjectDirectory,
  getProject,
} from '@/services/projects/api'
import {
  AppBar,
  Box,
  Breadcrumbs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material'
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import type { FC } from 'react'

const RouteComponent: FC = () => {
  const { path, data, project } = Route.useLoaderData()
  return (
    <Box>
      <AppBar
        variant="outlined"
        color="default"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        position="relative"
      >
        <Toolbar disableGutters variant="dense">
          <Breadcrumbs>
            {path.map((segment, idx) => {
              const to = `/${segment.path}`
              const isLast = idx === path.length - 1
              return isLast ? (
                <Typography key={to} color="text.primary">
                  {segment.label}
                </Typography>
              ) : (
                <StyledLink key={to} to={to}>
                  {segment.label}
                </StyledLink>
              )
            })}
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <Paper variant="outlined" sx={{ marginX: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.subdirectories.map((entry) => {
                console.debug(data)
                return (
                  <TableRow key={entry} hover>
                    <TableCell component="th">
                      <StyledLink
                        to={`/projects/$projectId/$`}
                        params={{
                          projectId: project.id,
                          _splat: `${data.path}/${entry}`,
                        }}
                      >
                        {entry.at(-1)}
                      </StyledLink>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Outlet />
    </Box>
  )
}

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,

  loader: (ctx) => {
    const segments = ctx.location.pathname.split('/').filter(Boolean)
    segments.shift()
    const project = getProject(ctx.params.projectId)
    if (project === null) {
      throw notFound()
    }
    return {
      path: segments.map((segment, idx) => ({
        label: idx === 0 ? project.name : segment,
        path: ['projects', ...segments.slice(0, idx + 1)].join('/'),
      })),
      data: generateFakeProjectDirectory(segments.slice(1).join('/')),
      project,
    }
  },
})
