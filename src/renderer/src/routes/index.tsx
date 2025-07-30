import { createFileRoute } from "@tanstack/react-router"
import { useLoggerStore } from "~/stores/useLoggerStore"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { logNotice } = useLoggerStore.getState()
    logNotice((await window.text.ping()) as string)
  },
})
