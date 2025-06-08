import { Markdown } from '@/components/Markdown'
import { StyledLink } from '@/components/StyledLink'
import { getProjectAll } from '@/services/project/api'
import { ProjectQueryBuilder } from '@/services/project/helper'
import {
  AddRounded,
  CodeRounded,
  FilterListRounded,
  LocalOfferOutlined,
  SearchRounded,
  UnfoldLessRounded,
  UnfoldMoreRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
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
import moment from 'moment'
import { useState, type FC } from 'react'
import { z } from 'zod'

const RouteComponent: FC = () => {
  const { items, search } = Route.useLoaderData()

  return (
    <Box sx={{ maxWidth: 'lg', marginX: 'auto', padding: 4 }}>
      <Stack spacing={1}>
        <form>
          <Toolbar variant="dense" disableGutters>
            <Button disableElevation disableRipple variant="contained">
              <AddRounded />
            </Button>
          </Toolbar>
        </form>
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
              <Stack direction="row" spacing={1} useFlexGap>
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disableRipple
                >
                  <SearchRounded />
                </Button>
                <Button variant="outlined" disableElevation disableRipple>
                  <FilterListRounded />
                </Button>
              </Stack>
              <Typography>{`Showing ${items.length} projects`}</Typography>
            </Stack>
          </Toolbar>
        </form>
        {items.map((item) => {
          const [collapsed, setCollapsed] = useState(true)
          return (
            <Card variant="outlined" key={item.id}>
              <CardHeader
                title={
                  <StyledLink
                    to="/"
                    sx={{
                      display: 'block',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {item.name}
                  </StyledLink>
                }
                action={
                  <IconButton onClick={() => setCollapsed((prev) => !prev)}>
                    {collapsed && <UnfoldMoreRounded />}
                    {!collapsed && <UnfoldLessRounded />}
                  </IconButton>
                }
              />
              {item.description !== undefined && (
                <CardContent sx={{ paddingY: 0 }}>
                  <Markdown content={item.description} />
                </CardContent>
              )}
              <Collapse in={!collapsed}>
                <Divider flexItem />
                <CardContent>
                  <Typography>
                    {`Updated ${moment(item.updatedAt).fromNow()}`}
                  </Typography>
                  <List
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                    disablePadding
                    subheader={
                      <ListSubheader
                        disableGutters
                        disableSticky
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CodeRounded />
                      </ListSubheader>
                    }
                  >
                    {item.tags.technologies.map((tech) => {
                      return (
                        <ListItem
                          key={`tech-${tech}`}
                          sx={{
                            width: 'fit-content',
                          }}
                        >
                          <ListItemText>
                            <StyledLink
                              to="."
                              search={{ technologies: [tech] }}
                            >
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
                    subheader={
                      <ListSubheader
                        disableGutters
                        disableSticky
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <LocalOfferOutlined />
                      </ListSubheader>
                    }
                  >
                    {item.tags.topics.length === 0 && (
                      <ListItem sx={{ width: 'fit-content' }}>
                        <ListItemText>No topic</ListItemText>
                      </ListItem>
                    )}
                    {item.tags.topics.map((topics) => {
                      return (
                        <ListItem
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
              </Collapse>
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
  status: fallback(z.string().optional(), undefined).catch(undefined),
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
      .withStatus(deps.search.status)
      .build()
    const items = await getProjectAll(query)
    return { items, search: deps.search }
  },
})
