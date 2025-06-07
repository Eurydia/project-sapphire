import { StyledLink } from '@/components/StyledLink'
import { getProjectAll } from '@/services/project/api'
import { ProjectQueryBuilder } from '@/services/project/helper'
import { SearchRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { type FC } from 'react'
import { z } from 'zod'

const RouteComponent: FC = () => {
  const { items, search } = Route.useLoaderData()

  return (
    <Box sx={{ maxWidth: 'lg', marginX: 'auto', padding: 4 }}>
      <Stack spacing={1}>
        <form>
          <Toolbar
            disableGutters
            sx={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <TextField
              name="name"
              fullWidth
              autoComplete="off"
              defaultValue={search.name}
              placeholder="Search project"
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: '100%' }}
            >
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disableRipple
              >
                <SearchRounded />
              </Button>
              <Typography>{`Showing ${items.length} project`}</Typography>
            </Stack>
          </Toolbar>
        </form>
        {items.map((item) => {
          return (
            <Card variant="outlined" key={item.id}>
              <CardHeader title={<StyledLink to="/">{item.name}</StyledLink>} />
              <CardContent>{item.description}</CardContent>
              <CardContent>
                <List
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                  disablePadding
                  dense
                  subheader={
                    <ListSubheader disableGutters disableSticky>
                      Technologies
                    </ListSubheader>
                  }
                >
                  {item.tags.technologies.map((tech) => {
                    return (
                      <ListItem
                        key={`tech-${tech}`}
                        dense
                        sx={{
                          width: 'fit-content',
                        }}
                      >
                        <ListItemText>
                          <StyledLink to="." search={{ technologies: [tech] }}>
                            {`${tech}`}
                          </StyledLink>
                        </ListItemText>
                      </ListItem>
                    )
                  })}
                </List>
                <List
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                  disablePadding
                  dense
                  subheader={
                    <ListSubheader disableGutters disableSticky>
                      Topics:
                    </ListSubheader>
                  }
                >
                  {item.tags.topics.map((topics) => {
                    return (
                      <ListItem
                        dense
                        key={`topic-${topics}`}
                        sx={{
                          width: 'fit-content',
                        }}
                      >
                        <ListItemText>
                          <StyledLink
                            to="."
                            search={{ technologies: [topics] }}
                          >
                            {`${topics}`}
                          </StyledLink>
                        </ListItemText>
                      </ListItem>
                    )
                  })}
                </List>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    </Box>
  )
}

const searchParamSchema = z.object({
  name: fallback(z.string().optional(), undefined).catch(undefined),
  technologies: fallback(z.string().array().optional(), undefined).catch(
    undefined,
  ),
  topics: fallback(z.string().array().optional(), undefined).catch(undefined),
})

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loaderDeps: ({ search }) => {
    return { search }
  },
  validateSearch: zodValidator(searchParamSchema),
  loader: async ({ deps }) => {
    const query = new ProjectQueryBuilder()
      .withName(deps.search.name)
      .withTechnologies(deps.search.technologies)
      .withTopics(deps.search.topics)
      .build()
    const items = await getProjectAll(query)
    return { items, search: deps.search }
  },
})
