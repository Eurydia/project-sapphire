import {
  Alert,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"
import { Fragment, memo } from "react"
import { ProjectCard } from "~/components/data-display/project-card"
import { StyledLink } from "~/components/navigation/styled-link"
import type { Project } from "~/db/models/project/project"
import { ProjectQueryForm } from "../form/project-query-form"

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
  const navigate = useNavigate()
  return (
    <Grid container spacing={1}>
      <Grid size={{ md: 3 }}>
        <Stack spacing={1}>
          <Paper variant="outlined">
            <StyledLink to="/projects/create">Create</StyledLink>
          </Paper>
          <Paper variant="outlined">
            <ProjectQueryForm
              onSubmit={(query) => {
                navigate({ to: "/projects", search: query })
              }}
            />
          </Paper>
        </Stack>
      </Grid>
      <Grid size="grow">
        <Stack spacing={1}>
          <Inner fetcher={fetcher} />
        </Stack>
      </Grid>
    </Grid>
  )
})
