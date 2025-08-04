import {
  AppBar,
  Breadcrumbs,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material"
import { useLocation } from "@tanstack/react-router"
import { memo, useMemo, type FC } from "react"
import { StyledLink } from "./styled-link"

export const NavBreadcrumbs: FC = memo(() => {
  const { pathname } = useLocation()
  const segments = useMemo(() => {
    const segments = pathname.split("/")
    segments.shift()
    const paths = segments.map((segment, index) => ({
      path: segments.slice(0, index + 1).join("/"),
      name: segment,
    }))
    paths.unshift({ path: "/", name: "root" })
    return paths
  }, [pathname])

  return (
    <AppBar
      position="sticky"
      variant="outlined"
      color="default"
      sx={{ padding: 0, borderWidth: 0 }}
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
        <Divider flexItem />
      </Toolbar>
    </AppBar>
  )
})
