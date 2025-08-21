import { projectPaginationQuerySchema } from "#/models/project/dto/pagination-project.dto"
import { FileSystemService } from "@/api/file-system.service"
import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectService } from "@/api/project.service"
import { ProjectList } from "@/components/data-display/project-list"
import { ProjectListPaginationControl } from "@/components/data-display/project-list-pagination-control"
import { ProjectQueryForm } from "@/components/form/project-query-form"
import { TypographyButton } from "@/components/input/typography-button"
import { StyledLink } from "@/components/navigation/styled-link"
import { Divider, Grid, Paper, Stack } from "@mui/material"
import {
  createFileRoute,
  useRouter,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { isLeft } from "fp-ts/lib/Either"
import { type FC } from "react"

const RouteComponent: FC = () => {
  const { paginationResult, formOptions } = Route.useLoaderData()
  const search = Route.useSearch()
  const router = useRouter()
  return (
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
          <Stack spacing={2} divider={<Divider flexItem />}>
            <Stack direction="row" spacing={2}>
              <TypographyButton
                onClick={async () => {
                  const result =
                    await FileSystemService.openDirDialog()
                  if (isLeft(result)) {
                    return
                  }

                  if (result.right.canceled) {
                    return
                  }
                  if (result.right.filePaths.length === 0) {
                    return
                  }

                  await ProjectService.createFromPaths(
                    result.right.filePaths,
                  ).then(() => router.invalidate())
                }}
              >
                {`[QUICK ADD]`}
              </TypographyButton>
              <StyledLink to="/projects/create">{`[ADD]`}</StyledLink>
            </Stack>
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
