import { CssBaseline, ThemeProvider } from "@mui/material"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { ToastContainer } from "react-toastify"
import { globalStyle } from "~/app/global-style"
import { theme } from "~/app/theme"
import { LogInspector } from "~/components/data-display/log-inspector"

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <ThemeProvider theme={theme}>
          {globalStyle}
          <CssBaseline />
          <LogInspector>
            <Outlet />
            <ToastContainer
              toastStyle={{ fontFamily: "monospace" }}
              pauseOnFocusLoss={false}
              position="bottom-left"
            />
          </LogInspector>
        </ThemeProvider>
        <TanStackRouterDevtools position="top-left" />
      </>
    )
  },
})
