import { projectPaginationQuerySchema } from "#/models/project/dto/pagination-project.dto"
import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectService } from "@/api/project.service"
import { ProjectList } from "@/components/data-display/project-list"
import { ProjectListPaginationControl } from "@/components/data-display/project-list-pagination-control"
import { ProjectQueryForm } from "@/components/form/project-query-form"
import { StyledLink } from "@/components/navigation/styled-link"
import { Divider, Grid, Paper, Stack } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import type { FC } from "react"

const RouteComponent: FC = () => {
  const { paginationResult, formOptions } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <Grid container spacing={1}>
      <Grid size={{ md: 12 }}>
        <Paper variant="outlined">
          <ProjectQueryForm
            onSubmit={(query) => {
              navigate({
                to: "/projects",
                search: {
                  query,
                },
              })
            }}
            formOptions={formOptions}
          />
        </Paper>
      </Grid>
      <Grid size={{ md: 4 }}>
        <Paper variant="outlined">
          <Stack spacing={2} divider={<Divider flexItem />}>
            <StyledLink to="/projects/create">{`[ADD]`}</StyledLink>
            <ProjectListPaginationControl
              search={search}
              pagination={paginationResult}
            />
          </Stack>
        </Paper>
      </Grid>
      <Grid size="grow">
        <ProjectList projects={paginationResult.items} />
      </Grid>
    </Grid>
  )
}

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  validateSearch: zodValidator(projectPaginationQuerySchema),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    return {
      paginationResult: await ProjectService.list(search),
      formOptions: {
        projects: await ProjectService.listNames(),
        tags: await ProjectTagService.listNames(),
      },
    }
  },
})
