import { Box } from "@mui/material"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { memo, type FC } from "react"

const RouteComponent: FC = memo(() => {
  return (
    <Box paddingY={1}>
      <Outlet />
    </Box>
  )
})

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
})
