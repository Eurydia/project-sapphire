import { projectPaginationQuerySchema } from "#/models/project/dto/pagination-project.dto"
import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectService } from "@/api/project.service"
import { ProjectList } from "@/components/data-display/project-list"
import { ProjectQueryForm } from "@/components/form/project-query-form"
import { StyledLink } from "@/components/navigation/styled-link"
import {
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import type { FC } from "react"

const RouteComponent: FC = () => {
  const {
    paginationResult: {
      items,
      pageCount,
      pageIndex,
      totalCount,
      resultPerPage,
    },
    formOptions,
  } = Route.useLoaderData()
  const { query } = Route.useSearch()
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
                  pageIndex,
                  resultPerPage,
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
            <Stack spacing={0.5}>
              <Typography>{`SHOWING: ${pageIndex * resultPerPage + 1}-${pageIndex * resultPerPage + (resultPerPage > items.length ? items.length : resultPerPage)} OF ${totalCount}`}</Typography>
              <Typography>{`PAGE: ${pageIndex + 1} OF ${pageCount}`}</Typography>
              <Stack spacing={2} direction="row">
                <StyledLink
                  to="."
                  search={{
                    query,
                    resultPerPage,
                    pageIndex: Math.max(0, pageIndex - 1),
                  }}
                  sx={{ textDecorationLine: "none" }}
                >
                  {`[PREV]`}
                </StyledLink>
                <StyledLink
                  to="."
                  search={{
                    query,
                    resultPerPage,
                    pageIndex: Math.min(
                      pageIndex + 1,
                      pageCount - 1,
                    ),
                  }}
                  sx={{ textDecorationLine: "none" }}
                >
                  {`[NEXT]`}
                </StyledLink>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
      <Grid size="grow">
        <ProjectList projects={items} />
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
