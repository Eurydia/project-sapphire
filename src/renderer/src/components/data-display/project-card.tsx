import { EditOutlined, FolderOpenOutlined, PushPin, PushPinOutlined } from '@mui/icons-material'
import {
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useRouter } from '@tanstack/react-router'
import type { FC } from 'react'
import { Fragment, memo, useCallback } from 'react'
import { openPath } from '~/api/fs'
import { StyledLink } from '~/components/navigation/styled-link'
import type { Project } from '~/db/models/project/project'
import { pinProject, unpinProject } from '~/db/projects'
import { ProjectCardMetadata } from './project-card-metadata'
import { ProjectCardTechList } from './project-card-tech-list'
import { ProjectCardTopicList } from './project-card-topic-list'

type Props = {
  project: Project
  dense?: boolean
}
export const ProjectCard: FC<Props> = memo(({ project, dense }) => {
  const {
    typography: { monospaceFontFamily, serifFontFamily },
    breakpoints
  } = useTheme()
  const isSmallScreen = useMediaQuery(breakpoints.down('md'))

  const router = useRouter()

  // const metadataItems = useMemo(() => {
  //   return [
  //     { label: 'created', value: project.metadata?.ctime.fromNow },
  //     {
  //       label: 'accessed',
  //       value: project.metadata?.atime.fromNow
  //     },
  //     {
  //       label: 'modified',
  //       value: project.metadata?.mtime.fromNow
  //     }
  //   ]
  // }, [project.metadata])

  const handleTogglePin = useCallback(() => {
    if (project.pinned) {
      unpinProject(project.uuid).then(() => router.invalidate())
    } else {
      pinProject(project.uuid).then(() => router.invalidate())
    }
  }, [project.pinned, project.uuid, router])

  return (
    <Paper variant="outlined">
      <Stack
        direction={{ xs: 'column-reverse', md: 'row' }}
        spacing={2}
        divider={<Divider flexItem orientation={isSmallScreen ? 'horizontal' : 'vertical'} />}
      >
        <Stack spacing={3} flexBasis={0} flexGrow={1} component="div">
          {dense && (
            <Stack>
              <Fragment>
                <Typography
                  fontFamily={monospaceFontFamily}
                  variant="subtitle2"
                  color="textSecondary"
                >
                  {project.uuid}
                </Typography>
                <Typography
                  fontFamily={monospaceFontFamily}
                  variant="subtitle2"
                  color="textSecondary"
                >
                  {project.root}
                </Typography>
              </Fragment>
            </Stack>
          )}
          <Stack>
            <Typography
              fontFamily={serifFontFamily}
              variant="h4"
              component="div"
              sx={{ width: 'fit-content' }}
            >
              <StyledLink to={'/projects/$uuid/edit'} params={{ uuid: project.uuid }}>
                {project.name}
              </StyledLink>
            </Typography>
            {project.description !== '' && (
              <Typography fontFamily={serifFontFamily}>{project.description}</Typography>
            )}
          </Stack>

          <ProjectCardMetadata root={project.root} />
          <Stack spacing={0.5}>
            <ProjectCardTechList techUuids={project.techUuids} />
            <ProjectCardTopicList topicUuids={project.topicUuids} />
          </Stack>
        </Stack>
        <Stack
          spacing={2}
          flexBasis={0}
          flexGrow={0}
          component="div"
          direction={{ xs: 'row', md: 'column' }}
        >
          <IconButton onClick={handleTogglePin}>
            {project.pinned ? <PushPin /> : <PushPinOutlined />}
          </IconButton>
          <IconButton
            onClick={() =>
              router.navigate({
                to: '/projects/$uuid/edit',
                params: { uuid: project.uuid }
              })
            }
          >
            <EditOutlined />
          </IconButton>
          <IconButton onClick={() => openPath(project.root)}>
            <FolderOpenOutlined />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  )
})
