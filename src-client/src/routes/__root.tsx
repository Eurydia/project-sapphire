import { events, extensions } from '@neutralinojs/lib'
import { ToastContainer } from 'react-toastify'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'
import { theme } from '@/app/theme'

export const Route = createRootRoute({
  component: () => {
    useEffect(() => {
      // This request will be queued and processed when the extension connects.
      ;(async () => {
        await extensions
          .dispatch('js.sapphire.server', 'initPing', 'Hello extension!')
          .catch((err) => {
            console.log("Extension isn't loaded!")
          })
      })()
      console.debug({ ext: window.NL_EXTENABLED })

      events.on('initPing', (evt) => console.debug(evt))
    }, [])
    return (
      <>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Outlet />
        </ThemeProvider>
        <ToastContainer pauseOnFocusLoss={false} />
        <TanStackRouterDevtools />
      </>
    )
  },
})
