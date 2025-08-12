import type { Project } from "#/models/project/project"
import { Alert, Stack, Typography } from "@mui/material"
import type { FC } from "react"
import { memo } from "react"
import { ProjectCard } from "./project-card"

type Props = {
  projects: Project[]
}
export const ProjectList: FC<Props> = memo(({ projects }) => {
  if (projects.length === 0) {
    return (
      <Alert severity="info">
        <Typography>{`No project to display`}</Typography>
      </Alert>
    )
  }
  return (
    <Stack spacing={1}>
      {projects.map((project) => (
        <ProjectCard key={project.uuid} project={project} />
      ))}
    </Stack>
  )
})
