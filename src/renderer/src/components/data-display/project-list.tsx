import { Alert, Grid, Stack, Typography } from "@mui/material"
import type { FC, ReactNode } from "react"
import { Fragment, memo } from "react"
import { ProjectCard } from "~/components/data-display/project-card"
import { StyledLink } from "~/components/navigation/styled-link"
import type { Project } from "~/db/models/project/project"

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
  slotPanel: ReactNode
  fetcher: Project[]
}
export const ProjectList: FC<Props> = memo(
  ({ fetcher, slotPanel }) => {
    return (
      <Grid container spacing={1}>
        <Grid size={{ md: 3 }}>{slotPanel}</Grid>
        <Grid size="grow">
          <Stack spacing={1}>
            <Inner fetcher={fetcher} />
          </Stack>
        </Grid>
      </Grid>
    )
  },
)
