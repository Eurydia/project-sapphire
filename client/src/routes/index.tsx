import { StyledLink } from '@/components/StyledLink'
import { getProjectAll } from '@/services/project/api'
import { ProjectQueryBuilder } from '@/services/project/helper'
import type { Project } from '@/types/Project'
import { SearchRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { useMemo, useState, type FC } from 'react'
import { z } from 'zod'

const useOrderProjects = (items: Project[]) => {
  const [sortOrder, setSortOrder] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'updatedAt' | 'createdAt'>(
    'name',
  )
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      if (aValue < bValue) {
        return sortOrder ? -1 : 1
      }
      if (aValue > bValue) {
        return sortOrder ? 1 : -1
      }
      return 0
    })
  }, [items, sortOrder, sortBy])

  return {
    sortedItems,
    sortOrder,
    setSortOrder,
    setSortBy,
    sortBy,
  }
}

const RouteComponent: FC = () => {
  const { items } = Route.useLoaderData()
  const { setSortBy, setSortOrder, sortBy, sortOrder, sortedItems } =
    useOrderProjects(items)

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
              defaultValue=""
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
              <CardContent
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
              >
                {item.tags.technologies.map((tech) => {
                  return (
                    <Paper
                      key={`tech-${tech}`}
                      variant="outlined"
                      sx={{
                        paddingX: 1,
                        borderRadius: ({ shape }) => shape.borderRadius,
                        width: 'fit-content',
                      }}
                    >
                      <Typography variant="subtitle1">
                        <StyledLink to="." search={{ technologies: [tech] }}>
                          {tech}
                        </StyledLink>
                      </Typography>
                    </Paper>
                  )
                })}
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
    return { items }
  },
})
