import { memo } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from '@tanstack/react-router'
import type { FC } from 'react'
import type { Project } from 'models/project/project'

type Props = { project: Project }
export const ProjectDetails: FC<Props> = memo(({ project }) => {
  return (
    <Paper variant="outlined">
      <Stack spacing={1}>
        <Link to="/projects/$uuid/edit" params={{ uuid: project.uuid }}>
          <Typography variant="subtitle1" component="div">
            Edit
          </Typography>
        </Link>
        <Typography variant="h3">{project.name}</Typography>
        <Typography>{project.root}</Typography>
        {project.description !== '' && (
          <Typography>{project.description}</Typography>
        )}
        <List>
          <ListItem>
            <ListItemText
              disableTypography
              secondary={
                <Stack spacing={0.5} direction="row" useFlexGap>
                  {project.topics.map(({ name }, index) => (
                    <Link to="/projects" key={`topic[${index}]`}>
                      {name}
                    </Link>
                  ))}
                </Stack>
              }
            >
              <Typography>{`Topics`}</Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText
              disableTypography
              secondary={
                <Stack spacing={0.5} direction="row" useFlexGap>
                  {project.technologies.map(({ name }, index) => (
                    <Link to="/projects" key={`technologies[${index}]`}>
                      {name}
                    </Link>
                  ))}
                </Stack>
              }
            >
              <Typography>{`Technologies`}</Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Stack>
    </Paper>
  )
})
