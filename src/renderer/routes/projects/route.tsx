import { createFileRoute, Outlet } from "@tanstack/react-router"
import { memo, type FC } from "react"

const RouteComponent: FC = memo(() => {
  return <Outlet />
})

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
})
