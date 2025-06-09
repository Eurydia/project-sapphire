import { Markdown } from '@/components/Markdown'
import { generateFakeProjectDirectory } from '@/services/projects/api'
import { Card, CardContent, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { type FC } from 'react'

const RouteComponent: FC = () => {
  const { data } = Route.useLoaderData()
  return (
    <Card variant="outlined">
      <CardContent>
        {data.readme !== undefined && (
          <Markdown content={data.readme.content} />
        )}
        {data.readme === undefined && <Typography>Read me unset</Typography>}
      </CardContent>
    </Card>
  )
}

export const Route = createFileRoute('/projects/$projectId/tree/$')({
  component: RouteComponent,
  loader: (ctx) => {
    const data = generateFakeProjectDirectory(
      `${ctx.params.projectId}/${ctx.params._splat}`,
    )
    return { data }
  },
})
