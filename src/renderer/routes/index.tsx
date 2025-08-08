import { StyledLink } from "@/components/navigation/styled-link"
import { Paper, Stack } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"

const RouteComponent = () => {
  return (
    <Stack spacing={1}>
      <Paper>
        <StyledLink to="/projects">{`[PROJECTS]`}</StyledLink>
      </Paper>
      <Paper>
        <StyledLink to="/project-tags">{`[PROJECT TAGS]`}</StyledLink>
      </Paper>
    </Stack>
  )
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
