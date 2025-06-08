import { Markdown } from '@/components/Markdown'
import { generateFakeProjectDirectory } from '@/services/projects/api'
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { type FC } from 'react'

const RouteComponent: FC = () => {
  const { data } = Route.useLoaderData()
  return (
    <Box margin="auto" padding={4}>
      {data.indexFile !== undefined && (
        <Card variant="outlined">
          <CardContent>
            <List dense disablePadding>
              <ListItem>
                <ListItemText
                  secondary={data.indexFile.name}
                  primary="File name"
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Path" secondary={data.indexFile.path} />
              </ListItem>
            </List>
          </CardContent>
          <Divider flexItem variant="middle" />
          <CardContent>
            <Markdown content={data.indexFile.content} />
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export const Route = createFileRoute('/projects/$projectId/')({
  component: RouteComponent,
  loader: (ctx) => {
    const segments = ctx.location.pathname.split('/').filter(Boolean)
    return {
      data: generateFakeProjectDirectory(segments.slice(2).join('/')),
    }
  },
})
