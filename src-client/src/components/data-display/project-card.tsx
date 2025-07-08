import { EditOutlined, PushPin, PushPinOutlined } from '@mui/icons-material'
import {
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { Fragment, memo, useCallback, useMemo } from 'react'
import { useRouter } from '@tanstack/react-router'
import { StyledLink } from '../navigation/styled-link'
import { TechTagList } from './tech-tag-list'
import { TopicTagList } from './topic-tag-list'
import type { FC } from 'react'
import type { Project } from '@/models/project/project'
import { pinProject, unpinProject } from '@/api/projects'

type Props = { project: Project; dense?: boolean }
export const ProjectCard: FC<Props> = memo(({ project, dense }) => {
  const {
    typography: { monospaceFontFamily, serifFontFamily },
  } = useTheme()

  const router = useRouter()

  const metadataItems = useMemo(() => {
    return [
      { label: 'created', value: project.metadata?.ctime.fromNow },
      {
        label: 'accessed',
        value: project.metadata?.atime.fromNow,
      },
      {
        label: 'modified',
        value: project.metadata?.mtime.fromNow,
      },
    ]
  }, [project.metadata])

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
        direction="row"
        spacing={2}
        divider={<Divider flexItem orientation="vertical" />}
      >
        <Stack spacing={3} flexBasis={0} flexGrow={1} component="div">
          {dense && (
            <Stack>
              <Fragment>
                <Typography
                  fontFamily={monospaceFontFamily}
                  variant="subtitle2"
                >
                  {project.uuid}
                </Typography>
                <Typography
                  fontFamily={monospaceFontFamily}
                  variant="subtitle2"
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
              <StyledLink
                to={'/projects/$uuid/edit'}
                params={{ uuid: project.uuid }}
              >
                {project.name}
              </StyledLink>
            </Typography>
            {project.description !== '' && (
              <Typography fontFamily={serifFontFamily}>
                {project.description}
              </Typography>
            )}
          </Stack>
          {dense && (
            <Stack>
              {metadataItems.map(({ label, value }, index) => (
                <Stack
                  key={`item-${index}`}
                  spacing={1}
                  flexDirection="row"
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Typography fontFamily={monospaceFontFamily}>
                    {`${label}:`}
                  </Typography>
                  {value === undefined && (
                    <Typography fontFamily={monospaceFontFamily} color="error">
                      {`unknown`}
                    </Typography>
                  )}
                  {value !== undefined && (
                    <Typography fontFamily={monospaceFontFamily}>
                      {value}
                    </Typography>
                  )}
                </Stack>
              ))}
            </Stack>
          )}
          {project.technologies.length > 0 && project.topics.length > 0 && (
            <Stack spacing={0.5}>
              {project.technologies.length > 0 && (
                <Stack
                  spacing={1}
                  flexDirection="row"
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Typography>{`tech(s):`}</Typography>
                  <TechTagList items={project.technologies} />
                </Stack>
              )}
              {project.topics.length > 0 && (
                <Stack
                  spacing={1}
                  flexDirection="row"
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Typography>{`topic(s):`}</Typography>
                  <TopicTagList items={project.topics} />
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
        <Stack spacing={2} flexBasis={0} flexGrow={0} component="div">
          <IconButton size="small" onClick={handleTogglePin}>
            {project.pinned ? <PushPin /> : <PushPinOutlined />}
          </IconButton>
          <StyledLink to="/projects/$uuid/edit" params={{ uuid: project.uuid }}>
            <EditOutlined />
          </StyledLink>
        </Stack>
      </Stack>
    </Paper>
  )
})
