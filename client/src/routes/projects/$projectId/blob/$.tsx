import { Markdown } from '@/components/Markdown'
import { StyledLink } from '@/components/StyledLink'
import { getProject } from '@/services/projects/api'
import {
  AppBar,
  Breadcrumbs,
  Card,
  CardContent,
  Toolbar,
  Typography,
} from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { type FC } from 'react'

const RouteComponent: FC = () => {
  const { data, segments } = Route.useLoaderData()
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

export const Route = createFileRoute('/projects/$projectId/blob/$')({
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
