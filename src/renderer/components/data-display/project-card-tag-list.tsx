import type { Project } from "#/models/project/project"
import { Stack } from "@mui/material"
import type { FC } from "react"
import { Fragment, memo } from "react"
import { StyledLink } from "../navigation/styled-link"

type InnerProps = {
  project: Project
}
const Inner: FC<InnerProps> = memo(({ project }) => {
  if (project.tags.length === 0) {
    return <Fragment />
  }
  return (
    <Stack
      spacing={0.5}
      useFlexGap
      flexWrap="wrap"
      direction="row"
      alignItems="center"
    >
      {project.tags.map(({ name, uuid }) => (
        <StyledLink
          key={`tag-${uuid}`}
          to="/project-tags/$uuid"
          params={{ uuid }}
        >
          {name}
        </StyledLink>
      ))}
    </Stack>
  )
})

type Props = {
  project: Project
}
export const ProjectCardTagList: FC<Props> = memo(
  ({ project }) => {
    return <Inner project={project} />
  },
)
