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
import { Fragment, type FC } from "react"

const RouteComponent: FC = () => {
  const { paginationResult, formOptions } = Route.useLoaderData()
  const search = Route.useSearch()
  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Paper variant="outlined">
            <ProjectQueryForm
              search={search}
              formOptions={formOptions}
            />
          </Paper>
        </Grid>
        <Grid size={{ sm: 12, md: 4 }}>
          <Paper variant="outlined">
            <Stack spacing={2}>
              <StyledLink to="/projects/create">{`[ADD]`}</StyledLink>
              <Divider flexItem />
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
    </Fragment>
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
