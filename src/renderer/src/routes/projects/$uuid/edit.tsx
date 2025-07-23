import { Paper } from "@mui/material"
import {
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router"
import type { FC } from "react"
import { memo, useCallback } from "react"
import { toast } from "react-toastify"
import { ProjectForm } from "~/components/form/ProjectForm"
import type { ProjectDto } from "~/db/models/project/dto/project-dto"
import { getProjectByUuid, upsertProject } from "~/db/projects"
import { listTech, listTechManyByUuids } from "~/db/technologies"
import { listTopic, listTopicManyByUuids } from "~/db/topics"
import { useLoggerStore } from "~/stores/useLoggerStore"

const RouteComponent: FC = memo(() => {
  const { project, techNames, topicNames, formOptions } =
    Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { uuid } = Route.useParams()

  const { logNotice, logWarn } = useLoggerStore()
  const handleSubmit = useCallback(
    (dto: ProjectDto) => {
      logNotice(
        `upserting project uuid=${uuid} with ${JSON.stringify(dto)}`,
      )
      upsertProject(uuid, dto)
        .then(() => {
          logNotice(`upserted project uuid=${uuid}`)
          toast.success("update saved")
          navigate({ to: "/projects" })
        })
        .catch((err) => {
          logWarn(
            `failed to upsert project uuid=${uuid}: ${err}`,
          )
          toast.error("update failed")
        })
    },
    [logNotice, logWarn, uuid],
  )

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
        action={handleSubmit}
        formOptions={formOptions}
      />
    </Paper>
  )
})

export const Route = createFileRoute("/projects/$uuid/edit")({
  component: RouteComponent,
  loader: async ({ params: { uuid } }) => {
    const { logNotice, logWarn } = useLoggerStore.getState()

    logNotice(`fetching project '${uuid}' for editing`)
    const project = await getProjectByUuid(uuid).then(
      (result) => {
        logNotice(`got result from database`)
        return result
      },
      (err) => {
        logWarn(`failed to get result from database: ${err}`)
        return null
      },
    )

    if (project === null) {
      logNotice("redirect to '/projects' due to database error")
      throw redirect({ to: "/projects" })
    }

    if (project === undefined) {
      logNotice(
        `redirect to 404 since project ${uuid} does not exist`,
      )
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
