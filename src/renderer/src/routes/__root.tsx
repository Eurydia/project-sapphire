import { CssBaseline, Grid, ThemeProvider } from "@mui/material"
import { Outlet, createRootRoute } from "@tanstack/react-router"
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
          <Grid container spacing={1}>
            <Grid size={{ md: "grow" }}>
              <Outlet />
            </Grid>
            <Grid size={{ md: 12 }} sx={{ height: "200px" }}>
              <LogInspector />
            </Grid>
          </Grid>
        </ThemeProvider>
        <ToastContainer pauseOnFocusLoss={false} />
        <TanStackRouterDevtools position="top-left" />
      </>
    )
  },
})
