import moment from 'moment'
import {
  Alert,
  AlertTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { Fragment, memo, use, useMemo } from 'react'
import type { FC } from 'react'
import type { Project } from '@/models/project/project'

type Props = {
  fetcher: Promise<Project | null>
}
export const ProjectMetadata: FC<Props> = memo(({ fetcher }) => {
  const project = use(fetcher)
  console.debug(project)
  const items = useMemo(() => {
    if (project === null || project.metadata === null) {
      return null
    }
    return [
      {
        label: 'Created at',
        value: moment(project.metadata.ctime).fromNow(),
      },
      {
        label: 'Accessed at',
        value: moment(project.metadata.atime).fromNow(),
      },
      {
        label: 'Modified at',
        value: moment(project.metadata.mtime).fromNow(),
      },
    ]
  }, [project])

  return (
    <Fragment>
      {items === null && (
        <Alert severity="error">
          <AlertTitle>Invalid metadata</AlertTitle>
        </Alert>
      )}
      {items !== null && (
        <List>
          {items.map(({ label, value }, index) => (
            <ListItem key={`item[${index}]`}>
              <ListItemText secondary={label}>{value}</ListItemText>
            </ListItem>
          ))}
        </List>
      )}
    </Fragment>
  )
})
