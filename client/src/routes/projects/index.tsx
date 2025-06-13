import { StyledLink } from '@/components/StyledLink'
import { ProjectController } from '@/controllers/projects.controller'
import {
  AddRounded,
  FilterListRounded,
  SearchRounded,
  UnfoldLessRounded,
  UnfoldMoreRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { useState, type FC } from 'react'
import { z } from 'zod'

const RouteComponent: FC = () => {
  const { projects, search } = Route.useLoaderData()

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
              <Typography>{projects.projectCountMsg}</Typography>
            </Stack>
          </Toolbar>
        </form>
        {projects.projects.map((project) => {
          const [collapsed, setCollapsed] = useState(true)
          return (
            <Card variant="outlined" key={project.id}>
              <CardHeader
                title={
                  <StyledLink
                    to="/projects/$projectId"
                    params={{ projectId: project.id }}
                    sx={{
                      display: 'block',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {project.name}
                  </StyledLink>
                }
                action={
                  <IconButton onClick={() => setCollapsed((prev) => !prev)}>
                    {collapsed && <UnfoldMoreRounded />}
                    {!collapsed && <UnfoldLessRounded />}
                  </IconButton>
                }
              />
              {/* {project.description !== undefined && (
                <CardContent sx={{ paddingY: 0 }}>
                  <Markdown content={project.description} />
                </CardContent>
              )} */}
              <Collapse in={!collapsed}>
                <Divider flexItem />
                {/* <CardContent>
                  <Typography>
                    {`Updated ${moment(item.modifiedAt).fromNow()}`}
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
                </CardContent> */}
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
  // technologies: fallback(z.string().array().optional(), undefined).catch(
  //   undefined,
  // ),
  // topics: fallback(z.string().array().optional(), undefined).catch(undefined),
  // status: fallback(z.string().optional(), undefined).catch(undefined),
})

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  loaderDeps: ({ search }) => {
    return { search }
  },
  validateSearch: zodValidator(searchParamSchema),
  loader: async ({ deps }) => {
    // const query = new ProjectQueryBuilder()
    //   .withName(deps.search.name)
    //   // .withTechnologies(deps.search.technologies)
    //   // .withTopics(deps.search.topics)
    //   // .withStatus(deps.search.status)
    //   .build()
    // const items = await getProjectAll(query)
    const projects = await ProjectController.Index()
    console.debug(projects)
    return { projects, search: deps.search }
  },
})
