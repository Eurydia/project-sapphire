import type { Project } from "#/models/project/project"
import { Alert, Stack, Typography } from "@mui/material"
import type { FC } from "react"
import { Fragment, memo } from "react"
import { StyledLink } from "../navigation/styled-link"
import { ProjectCard } from "./project-card"

type InnerProps = {
  fetcher: Props["fetcher"]
}
const Inner: FC<InnerProps> = memo(({ fetcher: items }) => {
  if (items.length === 0) {
    return (
      <Alert severity="info">
        <Typography>{`No project to display`}</Typography>
        <StyledLink to={"/projects/create"}>
          {`create one`}
        </StyledLink>
      </Alert>
    )
  }

  return (
    <Fragment>
      {items.map((item, index) => (
        <ProjectCard
          key={`project-entry[${index}]`}
          project={item}
        />
      ))}
    </Fragment>
  )
})

type Props = {
  fetcher: Project[]
}
export const ProjectList: FC<Props> = memo(({ fetcher }) => {
  return (
    <Stack spacing={1}>
      <Inner fetcher={fetcher} />
    </Stack>
  )
})
