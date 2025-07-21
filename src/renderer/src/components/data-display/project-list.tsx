import {
  Alert,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { isLeft, type Either } from "fp-ts/lib/Either"
import type { FC } from "react"
import { memo, Suspense, use, useEffect } from "react"
import { ProjectCard } from "~/components/data-display/project-card"
import { StyledLink } from "~/components/navigation/styled-link"
import type { Project } from "~/db/models/project/project"
import type { getProjectRootMetadata } from "~/db/projects"
import { useLoggerStore } from "~/stores/useLoggerStore"

type InnerProps = {
  fetcher: Props["fetcher"]
}
const Inner: FC<InnerProps> = memo(({ fetcher }) => {
  const { logError, logNotice } = useLoggerStore()
  const result = use(fetcher)

  useEffect(() => {
    if (isLeft(result)) {
      logError(
        `failed to fetch projects with error: ${String(result.left)}`,
      )
    } else {
      logNotice(
        `fetched projects success; found ${items.length} entries`,
      )
    }
  }, [result, logError, logNotice])
  if (isLeft(result)) {
    return (
      <Grid size="grow">
        <Alert severity="error" variant="outlined">
          <Paper variant="outlined">
            <Typography>{JSON.stringify(result)}</Typography>
          </Paper>
        </Alert>
      </Grid>
    )
  }
  const items = result.right

  return (
    <Grid container spacing={1}>
      <Grid size={{ md: 3 }}>
        <Stack spacing={1}>
          <Paper variant="outlined">
            <StyledLink to="/projects/create">Create</StyledLink>
          </Paper>
        </Stack>
      </Grid>
      {items.length === 0 && (
        <Grid size="grow">
          <Alert severity="info">
            <Typography>{`No project to display`}</Typography>
            <StyledLink to={"/projects/create"}>
              {`create one`}
            </StyledLink>
          </Alert>
        </Grid>
      )}
      {items.length > 0 && (
        <Grid size="grow">
          <Stack spacing={1}>
            {items.map((item, index) => (
              <ProjectCard
                dense
                key={`project-entry[${index}]`}
                project={item}
              />
            ))}
          </Stack>
        </Grid>
      )}
    </Grid>
  )
})

type Props = {
  fetcher: Promise<
    Either<
      Error,
      (Project & {
        metadata: ReturnType<typeof getProjectRootMetadata>
      })[]
    >
  >
}
export const ProjectList: FC<Props> = memo(({ fetcher }) => {
  return (
    <Suspense>
      <Inner fetcher={fetcher} />
    </Suspense>
  )
})
