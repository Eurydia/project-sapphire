import { os } from '@neutralinojs/lib'
import { createFileRoute } from '@tanstack/react-router'
import { memo, useEffect } from 'react'
import { Box, Stack, TextField } from '@mui/material'
import type { FC } from 'react'
import { fetchProjectAll } from '@/api/projects'
import { ProjectList } from '@/components/data-display/project-list/project-list'

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()

  useEffect(() => {
    ;async () => {
      const entry = await os.showFolderDialog('Select installation directory')
      console.log('You have selected:', entry)
    }
  }, [])
  return (
    <Box padding={2} maxWidth="lg" marginX="auto">
      <Stack spacing={1}>
        <TextField fullWidth size="small" />
        <ProjectList dense fetcher={projects} />
      </Stack>
    </Box>
  )
})

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  loader: () => {
    return { projects: fetchProjectAll() }
  },
})
