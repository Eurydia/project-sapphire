import {
  RouterProvider,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

// Import the generated route tree
import { HotkeysProvider } from "react-hotkeys-hook"
import { routeTree } from "./routeTree.gen"

const hashHistory = createHashHistory()
// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  history: hashHistory,
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <HotkeysProvider>
        <RouterProvider router={router} />
      </HotkeysProvider>
    </StrictMode>,
  )
}
