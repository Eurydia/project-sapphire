import { createFileRoute, Outlet } from "@tanstack/react-router"
import { HotkeysProvider } from "react-hotkeys-hook"

export const Route = createFileRoute("/project-tags")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <HotkeysProvider>
      <Outlet />
    </HotkeysProvider>
  )
}
