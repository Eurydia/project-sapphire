import { StyledLink } from '@/components/StyledLink'
import { getProjectAll } from '@/services/project.api'
import { Box, List, ListItem, Typography } from '@mui/material'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async () => {
    return await getProjectAll()
  },
})

function RouteComponent() {
  const items = useLoaderData({ from: '/', strict: true })
  return (
    <Box sx={{ maxWidth: 'lg', marginX: 'auto' }}>
      <List>
        {items.map((item) => {
          return (
            <ListItem
              key={`project-${item.id}`}
              sx={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <StyledLink to="/">{item.name}</StyledLink>
              <Typography>{item.description}</Typography>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
