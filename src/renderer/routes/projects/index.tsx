import { projectQuerySchema } from "#/models/project/dto/query-project.dto"
import { ProjectGroupService } from "@/api/project-group.service"
import { ProjectTechnologyService } from "@/api/project-technology.service"
import { ProjectTopicService } from "@/api/project-topic.service"
import { ProjectService } from "@/api/project.service"
import { ProjectList } from "@/components/data-display/project-list"
import { ProjectQueryForm } from "@/components/form/project-query-form"
import { StyledLink } from "@/components/navigation/styled-link"
import { Box, Grid, Paper, Stack } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
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
  validateSearch: zodValidator(projectQuerySchema),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    return {
      projects: await ProjectService.list(search),
      formOptions: {
        projects: await ProjectService.listNames(),
        technologies: await ProjectTechnologyService.listNames(),
        topics: await ProjectTopicService.listNames(),
        groups: await ProjectGroupService.listNames(),
      },
    }
  },
})
