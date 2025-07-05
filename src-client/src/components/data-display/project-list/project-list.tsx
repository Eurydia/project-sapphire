import { Fragment, Suspense, memo, use } from 'react'
import { Alert, Stack, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'
import { ProjectCard } from '../project-card/ProjectCard'
import { ProjectCardSkeleton } from './project-card-skeleton'
import type { FC } from 'react'
import type { Project } from '@/models/project/project'

type InternalListProps = {
  fetcher: Promise<Array<Project> | null>
}
const Inner: FC<InternalListProps> = memo(({ fetcher }) => {
  const items = use(fetcher)
  return (
    <Fragment>
      {items !== null &&
        items.map((project, index) => (
          <ProjectCard key={`project-entry[${index}]`} project={project} />
        ))}
      {items !== null && items.length === 0 && (
        <Alert severity="info">
          <Typography>{`No registered project`}</Typography>
          <Link to={'/projects/create'}>{`create one`}</Link>
        </Alert>
      )}
      {items === null && (
        <Alert severity="error">
          <Typography>{`Something has gone wrong`}</Typography>
        </Alert>
      )}
    </Fragment>
  )
})

type Props = { fetcher: Promise<Array<Project> | null> }
export const ProjectList: FC<Props> = memo(({ fetcher: itemsPromise }) => {
  return (
    <Stack spacing={1}>
      <Suspense
        fallback={
          <Fragment>
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </Fragment>
        }
      >
        <Inner fetcher={itemsPromise} />
      </Suspense>
    </Stack>
  )
})
