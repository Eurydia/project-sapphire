import { StyledLink } from '@/components/StyledLink'
import {
  generateFakeProjectDirectory,
  getProject,
} from '@/services/projects/api'
import {
  FolderRounded,
  MoreVertRounded,
  SyncRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
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
import moment from 'moment'
import { Fragment, type FC } from 'react'

const RouteComponent: FC = () => {
  const { path, data, project } = Route.useLoaderData()
  return (
    <Fragment>
      <Box
        marginX={4}
        marginY={8}
        sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}
      >
        <Toolbar variant="dense" disableGutters sx={{ gap: 1 }}>
          <Button variant="contained" disableElevation disableRipple>
            <SyncRounded />
          </Button>
          <Typography>{`Synchronized ${moment(data.lastSynchronized).fromNow()}`}</Typography>
        </Toolbar>

        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Name</TableCell>
                  <TableCell>Last updated</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.subdirectories.map(({ path, updatedAt }, index) => {
                  return (
                    <TableRow
                      key={`row-dir-${index}`}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <FolderRounded color="primary" fontSize="small" />
                      </TableCell>
                      <TableCell>
                        <StyledLink
                          to={`/projects/$projectId/tree/$`}
                          params={{
                            projectId: project.id,
                            _splat: `${data.path}/${path}`,
                          }}
                        >
                          {path}
                        </StyledLink>
                      </TableCell>
                      <TableCell>{moment(updatedAt).fromNow()}</TableCell>
                      <TableCell>
                        <IconButton>
                          <MoreVertRounded />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {data.files.map(({ path, updatedAt }, index) => {
                  return (
                    <TableRow
                      key={`row-file-${index}`}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell padding="checkbox" />
                      <TableCell>{path}</TableCell>
                      <TableCell>{moment(updatedAt).fromNow()}</TableCell>
                      <TableCell>
                        <IconButton>
                          <MoreVertRounded />
                        </IconButton>
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
      data: generateFakeProjectDirectory(segments.slice(1).join('/')),
      project,
    }
  },
})
