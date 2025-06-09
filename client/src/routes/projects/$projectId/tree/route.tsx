import type { StyledLink } from '@/components/StyledLink'
import { AppBar, Breadcrumbs, Toolbar, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/tree')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AppBar
      variant="outlined"
      color="default"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Toolbar disableGutters variant="dense">
        <Breadcrumbs>
          {path.map((segment, idx) => {
            const to = `/${segment.path}`
            const isLast = idx === path.length - 1
            return isLast ? (
              <Typography key={to} color="text.primary">
                {segment.label}
              </Typography>
            ) : (
              <StyledLink key={to} to={to}>
                {segment.label}
              </StyledLink>
            )
          })}
        </Breadcrumbs>
      </Toolbar>
    </AppBar>
  )
}
