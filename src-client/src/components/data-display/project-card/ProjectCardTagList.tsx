import { Grid, Stack, Typography } from '@mui/material'
import { Fragment, memo } from 'react'
import type { FC, ReactNode } from 'react'

type Props = {
  label: string
  items: Array<{ name: string; uuid: string }>
  children: (item: Props['items'][number]) => ReactNode
}
export const ProjectCardTagList: FC<Props> = memo(
  ({ label, items, children }) => {
    return (
      <Grid container spacing={1}>
        <Grid size={{ md: 3 }}>
          <Typography>{label}</Typography>
        </Grid>
        <Grid size={{ md: 9 }}>
          <Stack spacing={1} direction="row">
            {items.map((item, index) => (
              <Fragment key={`tag-item[${index}]`}>{children(item)}</Fragment>
            ))}
          </Stack>
        </Grid>
      </Grid>
    )
  },
)
