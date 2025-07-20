import {
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { useLoggerStore } from "~/stores/useLoggerStore"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    useLoggerStore
      .getState()
      .logNotice("landed on '/', redirecting to '/projects'")
    throw redirect({ to: "/projects" })
  },
})
