import { Skeleton, Stack, Typography } from '@mui/material'
import { memo, Suspense, use, useMemo, type FC } from 'react'
import { getProjectRootMetadata } from '~/db/projects'

type InnerProps = {
  fetcher: Promise<{ label: string; value: string | undefined }[]>
}
const Inner: FC<InnerProps> = memo(({ fetcher }) => {
  const metadataItems = use(fetcher)

  return (
    <Stack>
      {metadataItems.map(({ label, value }, index) => (
        <Stack key={`item-${index}`} spacing={1} flexDirection="row" useFlexGap flexWrap="wrap">
          <Typography variant="subtitle2" color="textSecondary">
            {`${label}:`}
          </Typography>
          {value === undefined && (
            <Typography variant="subtitle2" color="error">
              {`unknown`}
            </Typography>
          )}
          {value !== undefined && (
            <Typography color="textSecondary" variant="subtitle2">
              {value}
            </Typography>
          )}
        </Stack>
      ))}
    </Stack>
  )
})

type Props = {
  root: string
}
export const ProjectCardMetadata: FC<Props> = memo(({ root }) => {
  const fetcher = useMemo(async () => {
    return getProjectRootMetadata(root).then((metadata) => [
      {
        label: 'created',
        value: metadata === null ? undefined : `${metadata.ctime.fromNow} (${metadata.ctime.exact})`
      },
      {
        label: 'accessed',
        value: metadata === null ? undefined : `${metadata.atime.fromNow} (${metadata.atime.exact})`
      },
      {
        label: 'modified',
        value: metadata === null ? undefined : `${metadata.mtime.fromNow} (${metadata.mtime.exact})`
      }
    ])
  }, [root])

  return (
    <Suspense
      fallback={
        <Stack>
          {['created', 'accessed', 'modified'].map((label, index) => (
            <Stack key={`item-${index}`} spacing={1} flexDirection="row" useFlexGap flexWrap="wrap">
              <Typography variant="subtitle2" color="textSecondary">
                {`${label}:`}
              </Typography>
              <Typography color="textSecondary" variant="subtitle2" width="50%">
                <Skeleton />
              </Typography>
            </Stack>
          ))}
        </Stack>
      }
    >
      <Inner fetcher={fetcher} />
    </Suspense>
  )
})
