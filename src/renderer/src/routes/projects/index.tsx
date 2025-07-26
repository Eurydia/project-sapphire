import { Paper, Stack } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import _ from "lodash"
import type { FC } from "react"
import { memo } from "react"
import { ProjectList } from "~/components/data-display/project-list"
import { ProjectQueryForm } from "~/components/form/project-query-form"
import { StyledLink } from "~/components/navigation/styled-link"
import { projectQuerySchema } from "~/db/models/project/dto/project-dto"
import { listProjectGroups } from "~/db/project-groups"
import { listProjects } from "~/db/projects"
import { listTech } from "~/db/technologies"
import { listTopic } from "~/db/topics"

const RouteComponent: FC = memo(() => {
  const { projects, formOptions } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  return (
    <ProjectList
      fetcher={projects}
      slotPanel={
        <Stack spacing={1}>
          <Paper variant="outlined">
            <StyledLink to="/projects/create">Create</StyledLink>
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
      }
    />
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
        topics: (await listTopic()).map(({ name }) => name),
        groups: (await listProjectGroups()).map(
          ({ name }) => name,
        ),
      },
    }
  },
})
