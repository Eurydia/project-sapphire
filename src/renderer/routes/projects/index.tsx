import { projectQuerySchema } from "#/services/project/dto/project-dto"
import { ProjectList } from "@/components/data-display/project-list"
import { ProjectQueryForm } from "@/components/form/project-query-form"
import type { StyledLink } from "@/components/navigation/styled-link"
import { Box, Grid, Paper, Stack } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import _ from "lodash"
import type { FC } from "react"
import { memo } from "react"

const RouteComponent: FC = memo(() => {
  const { projects, formOptions } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  return (
    <Box maxWidth="lg" sx={{ marginX: "auto" }}>
      <Grid container spacing={1}>
        <Grid size={{ md: 4 }}>
          <Stack spacing={1}>
            <Paper variant="outlined">
              <StyledLink to="/projects/create">
                Create
              </StyledLink>
            </Paper>
            <Paper variant="outlined">
              <ProjectQueryForm
                onSubmit={(query) => {
                  navigate({ to: "/projects", search: query })
                }}
                formOptions={formOptions}
              />
            </Paper>
          </Stack>
        </Grid>
        <Grid size="grow">
          <ProjectList fetcher={projects} />
        </Grid>
      </Grid>
    </Box>
  )
})

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  validateSearch: zodValidator(projectQuerySchema.optional()),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    return {
      projects: await listProjects(search).catch(() => {
        return []
      }),
      formOptions: {
        projects: _.uniq(
          (await listProjects()).map(({ name }) => name),
        ),
        technologies: (await listTech()).map(({ name }) => name),
        topics: [],
        groups: (await ProjectGroupService.list()).map(
          ({ name }) => name,
        ),
      },
    }
  },
})
