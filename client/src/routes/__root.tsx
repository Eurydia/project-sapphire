import { theme } from '@/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { FC } from 'react'

const RouteComponent: FC = () => {
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

export const Route = createRootRoute({
  component: RouteComponent,
})
