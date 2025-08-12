import { globalStyle } from "@/app/global-style"
import { theme } from "@/app/theme"
import { NavBreadcrumbs } from "@/components/navigation/nav-breacrumb"
import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import {
  createRootRoute,
  Outlet,
  useRouter,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { useHotkeys } from "react-hotkeys-hook"
import { ToastContainer } from "react-toastify"

const RouteComponent = () => {
  const router = useRouter()
  useHotkeys(`alt+arrowleft`, () => {
    router.history.back()
  })
  useHotkeys(`alt+arrowright`, () => {
    router.history.forward()
  })
  return (
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
      <TanStackRouterDevtools />
    </ThemeProvider>
  )
}
export const Route = createRootRoute({
  component: RouteComponent,
})
