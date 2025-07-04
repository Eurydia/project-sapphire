import { Paper, Stack, Typography } from '@mui/material'
import { memo } from 'react'
import { Link } from '@tanstack/react-router'
import { ProjectCardTagList } from './ProjectCardTagList'
import type { FC } from 'react'
import type { Project } from '@/models/project/project'

type Props = { project: Project }
export const ProjectCard: FC<Props> = memo(
  ({ project: { name, uuid, description, technologies, topics } }) => {
    return (
      <Paper variant="outlined">
        <Stack spacing={1}>
          <Typography
            variant="h5"
            component="div"
            sx={{ width: 'fit-content' }}
          >
            <Link to={'/projects/$uuid'} params={{ uuid }}>
              {name}
            </Link>
          </Typography>
          {description !== '' && (
            <Typography component="div">{description}</Typography>
          )}
          <ProjectCardTagList label="technologies" items={technologies}>
            {({ name: name_ }) => (
              <Typography>
                <Link to="/projects">{name_}</Link>
              </Typography>
            )}
          </ProjectCardTagList>
          <ProjectCardTagList label="topics" items={topics}>
            {({ name: name_ }) => (
              <Typography>
                <Link to="/projects">{name_}</Link>
              </Typography>
            )}
          </ProjectCardTagList>
        </Stack>
      </Paper>
    )
  },
)
