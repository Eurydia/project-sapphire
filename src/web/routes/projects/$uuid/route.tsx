import { Outlet, createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'
import type { FC } from 'react'

const RouteComponent: FC = memo(() => {
  return <Outlet />
})

export const Route = createFileRoute('/projects/$uuid')({
  component: RouteComponent,
})
