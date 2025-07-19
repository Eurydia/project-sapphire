import { Paper } from "@mui/material"
import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router"
import type { FC } from "react"
import { memo } from "react"
import { toast } from "react-toastify"
import { ProjectForm } from "~/components/form/ProjectForm"
import { getProjectByUuid, upsertProject } from "~/db/projects"
import { listTech, listTechManyByUuids } from "~/db/technologies"
import { listTopic, listTopicManyByUuids } from "~/db/topics"

const RouteComponent: FC = memo(() => {
  const { project, techNames, topicNames, formOptions } =
    Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { uuid } = Route.useParams()

  return (
    <Paper variant="outlined">
      <ProjectForm
        init={{
          description: project.description,
          name: project.name,
          root: project.root,
          techNames,
          topicNames,
        }}
        action={(dto) =>
          upsertProject(uuid, dto)
            .then(() => navigate({ to: "/projects" }))
            .then(() => toast.success("update saved"))
            .catch(() => toast.error("update failed"))
        }
        formOptions={formOptions}
      />
    </Paper>
  )
})

export const Route = createFileRoute("/projects/$uuid/edit")({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    const project = await getProjectByUuid(uuid)

    if (project === undefined) {
      throw notFound()
    }

    const techNames = (
      await listTechManyByUuids(project.techUuids)
    ).map(({ name }) => name)
    const topicNames = (
      await listTopicManyByUuids(project.topicUuids)
    ).map(({ name }) => name)

    return {
      project,
      techNames,
      topicNames,
      formOptions: {
        topics: (await listTopic()).map(({ name }) => name),
        technologies: (await listTech()).map(({ name }) => name),
      },
    }
  },
})
