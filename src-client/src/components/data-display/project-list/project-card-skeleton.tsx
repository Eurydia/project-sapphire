import { Link, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { memo } from 'react'
import { uuid } from 'zod/v4'
import type { FC } from 'react'
import type { ProjectCardTagList } from '../project-card/ProjectCardTagList'

export const ProjectCardSkeleton: FC = memo(() => {
  return (
    <Paper variant="outlined">
      <Stack spacing={1}>
        <Typography variant="h5" sx={{ width: { md: '20%' } }}>
          <Skeleton />
        </Typography>
        <Typography component="div">
          <Skeleton />
        </Typography>
        <Typography component="div">
          <Skeleton />
        </Typography>
        <Typography component="div" sx={{ width: { md: '75%' } }}>
          <Skeleton />
        </Typography>
      </Stack>
    </Paper>
  )
})
