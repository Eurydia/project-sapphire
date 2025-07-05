import moment from 'moment'
import {
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
} from '@mui/material'
import { Fragment, Suspense, memo, use, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import type { ProjectMetadata } from '@/models/project/project'

type InnerProps = {
  fetcher: Props['fetcher']
}
const Inner: FC<InnerProps> = memo(({ fetcher }) => {
  const metadata = use(fetcher)

  const formatDate = useCallback((dt: string | undefined) => {
    if (dt === undefined) {
      return 'unknown'
    }
    return moment(dt).fromNow()
  }, [])

  const items = useMemo(() => {
    return [
      {
        label: 'Created',
        value: formatDate(metadata?.ctime),
      },
      {
        label: 'Accessed',
        value: formatDate(metadata?.atime),
      },
      {
        label: 'Modified',
        value: formatDate(metadata?.mtime),
      },
    ]
  }, [metadata])

  return (
    <Fragment>
      {metadata === null && (
        <Alert severity="warning">
          <AlertTitle>Invalid metadata</AlertTitle>
        </Alert>
      )}
      <List>
        {items.map(({ label, value }, index) => (
          <ListItem key={`item[${index}]`}>
            <ListItemText secondary={value}>{label}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Fragment>
  )
})

type Props = {
  fetcher: Promise<ProjectMetadata | null>
}
export const ProjectMetadataDisplay: FC<Props> = memo(({ fetcher }) => {
  return (
    <Stack spacing={1}>
      <Suspense
        fallback={
          <List>
            {['Created', 'Accessed', 'Modified'].map((label, index) => (
              <ListItem key={`item[${index}]`}>
                <ListItemText secondary={<Skeleton />}>{label}</ListItemText>
              </ListItem>
            ))}
          </List>
        }
      >
        <Inner fetcher={fetcher} />
      </Suspense>
    </Stack>
  )
})
