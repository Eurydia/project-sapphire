import { Markdown } from '@/components/Markdown'
import {
  generateFakeProjectDirectory,
  getProject,
} from '@/services/projects/api'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Typography,
} from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'
import moment from 'moment'
import { useState, type FC } from 'react'

const RouteComponent: FC = () => {
  const { data, project } = Route.useLoaderData()
  const [tab, setTab] = useState<'readme' | 'metadata'>(
    data.readme !== undefined ? 'readme' : 'metadata',
  )
  return (
    <Card variant="outlined">
      <TabContext value={tab}>
        <TabList onChange={(_, value) => setTab(value)}>
          <Tab label="Read me" value="readme" />
          <Tab label="Metadata" value="metadata" />
        </TabList>
        <CardContent>
          <TabPanel value="readme" sx={{ padding: 0 }} keepMounted>
            {data.readme !== undefined && (
              <Stack
                spacing={1}
                divider={<Divider flexItem variant="middle" />}
              >
                <List dense disablePadding>
                  <ListItem>
                    <ListItemText
                      secondary={data.readme.name}
                      primary="File name"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Path" secondary={data.readme.path} />
                  </ListItem>
                </List>
                <Markdown content={data.readme.content} />
              </Stack>
            )}
            {data.readme === undefined && <Typography>Unset</Typography>}
          </TabPanel>
          <TabPanel value="metadata" sx={{ padding: 0 }} keepMounted>
            <List dense disablePadding>
              <ListItem>
                <ListItemText
                  primary="Updated"
                  secondary={moment(project.updatedAt).fromNow()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Created"
                  secondary={moment(project.createdAt).fromNow()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Technologies"
                  secondary={project.tags.technologies.join(', ')}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  disableTypography
                  primary="Topics"
                  secondary={project.tags.topics.join(', ')}
                />
              </ListItem>
            </List>
            <Markdown content={project.description ?? ''} />
          </TabPanel>
        </CardContent>
      </TabContext>
    </Card>
  )
}

export const Route = createFileRoute('/projects/$projectId/')({
  component: RouteComponent,
  loader: async (ctx) => {
    const project = getProject(ctx.params.projectId)
    if (project === null) {
      throw notFound()
    }
    const segments = ctx.location.pathname.split('/').filter(Boolean)
    return {
      data: generateFakeProjectDirectory(segments.slice(2).join('/')),
      project,
    }
  },
})
