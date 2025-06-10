import { Markdown } from '@/components/Markdown'
import { StyledLink } from '@/components/StyledLink'
import {
  generateFakeProjectDirectory,
  getProject,
} from '@/services/projects/api'
import { FolderRounded, MoreVertRounded } from '@mui/icons-material'
import {
  AppBar,
  Breadcrumbs,
  Card,
  CardContent,
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
import { createFileRoute, notFound } from '@tanstack/react-router'
import moment from 'moment'
import { type FC } from 'react'

const RouteComponent: FC = () => {
  const { data, segments, project } = Route.useLoaderData()
  return (
    <>
      <AppBar
        variant="outlined"
        color="default"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Toolbar disableGutters variant="dense">
          <Breadcrumbs>
            {segments.map((segment, idx) => {
              const to = `/${segment.href}`
              const isLast = idx === segments.length - 1
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
              {data.subdirectories.map(({ name, path, updatedAt }, index) => {
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
                          _splat: path,
                        }}
                      >
                        {name}
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
      <Card variant="outlined">
        <CardContent>
          {data.readme !== undefined && (
            <Markdown content={data.readme.content} />
          )}
          {data.readme === undefined && <Typography>Read me unset</Typography>}
        </CardContent>
      </Card>
    </>
  )
}

export const Route = createFileRoute('/projects/$projectId/tree/$')({
  component: RouteComponent,
  loader: (ctx) => {
    const project = getProject(ctx.params.projectId)
    if (project === null) {
      throw notFound()
    }
    console.debug(ctx.params._splat)
    const data = generateFakeProjectDirectory(ctx.params._splat ?? '')
    const rawSegments = (ctx.params._splat ?? '').split('/').filter(Boolean)
    const segments = [
      {
        label: ctx.params.projectId,
        href: `/projects/${ctx.params.projectId}`,
      },
      ...rawSegments.map((seg, idx) => ({
        label: seg,
        href:
          `/projects/${ctx.params.projectId}/tree/` +
          rawSegments.slice(0, idx + 1).join('/'),
      })),
    ]

    return { data, segments, project }
  },
})
