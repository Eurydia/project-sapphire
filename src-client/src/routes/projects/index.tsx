import { Link, createFileRoute } from '@tanstack/react-router'
import { Fragment, Suspense, memo, use } from 'react'
import {
  Alert,
  AlertTitle,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import type { FC } from 'react'
import type { Project } from '@/models/project/project'
import { fetchProjectAll } from '@/api/projects'
import { ProjectCard } from '@/components/data-display/project-card/ProjectCard'
import { ProjectList } from '@/components/data-display/project-list/project-list'

const RouteComponent: FC = memo(() => {
  const { projects } = Route.useLoaderData()

  return <ProjectList fetcher={projects} />
})

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  loader: () => {
    return { projects: fetchProjectAll() }
  },
})
