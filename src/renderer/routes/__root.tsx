import { globalStyle } from "@/app/global-style"
import { theme } from "@/app/theme"
import { NavBreadcrumbs } from "@/components/navigation/nav-breacrumb"
import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { ToastContainer } from "react-toastify"

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <ThemeProvider theme={theme}>
          {globalStyle}
          <CssBaseline />
          <NavBreadcrumbs />
          <Box
            maxWidth={{ md: "lg", sm: "md" }}
            marginX="auto"
            padding={2}
          >
            <Outlet />
          </Box>
          <ToastContainer
            toastStyle={{ fontFamily: "monospace" }}
            pauseOnFocusLoss={false}
            position="bottom-left"
          />
        </ThemeProvider>
        <TanStackRouterDevtools position="top-right" />
      </>
    )
  },
})
