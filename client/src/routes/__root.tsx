import { theme } from '@/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  component: RouteComponent,
})

function RouteComponent(): ReactNode {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Outlet />
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  )
}
