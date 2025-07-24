import {
  AppBar,
  Breadcrumbs,
  Toolbar,
  Typography,
} from "@mui/material"
import { useLocation } from "@tanstack/react-router"
import { memo, useMemo, type FC } from "react"
import { useLoggerStore } from "~/stores/useLoggerStore"
import { StyledLink } from "./styled-link"

export const NavBreadcrumbs: FC = memo(() => {
  const { pathname } = useLocation()
  const { logNotice } = useLoggerStore()
  const segments = useMemo(() => {
    const segments = pathname.split("/")
    return segments.map((segment, index) => ({
      path: segments.slice(0, index + 1).join("/"),
      name: segment,
    }))
  }, [pathname])

  return (
    <AppBar
      position="sticky"
      variant="outlined"
      color="default"
      sx={{ padding: 0 }}
    >
      <Toolbar variant="dense">
        <Breadcrumbs>
          {segments.map(({ path, name }, index) =>
            index + 1 < segments.length ? (
              <StyledLink key={`crumb-${index}`} to={path}>
                {name}
              </StyledLink>
            ) : (
              <Typography>{name}</Typography>
            ),
          )}
        </Breadcrumbs>
      </Toolbar>
    </AppBar>
  )
})
