import { Grid, List, ListItem, ListItemText, Paper } from '@mui/material'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'
import type { FC } from 'react'

const RouteComponent: FC = memo(() => {
  return (
    <Grid container spacing={1} sx={{ padding: 2 }}>
      <Grid size={{ md: 2 }}>
        <Paper variant="outlined">
          <List disablePadding dense>
            <ListItem>
              <ListItemText>
                <Link to="/projects">{`List`}</Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Link to="/projects/create">{`Register`}</Link>
              </ListItemText>
            </ListItem>
          </List>
        </Paper>
      </Grid>
      <Grid size={{ md: 10 }}>
        <Outlet />
      </Grid>
    </Grid>
  )
})

export const Route = createFileRoute('/projects')({
  component: RouteComponent,
})
