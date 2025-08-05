import { StyledLink } from "@/components/navigation/styled-link"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/project-tags/$uuid/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { uuid } = Route.useParams()
  return (
    <StyledLink to="/project-tags/$uuid/edit" params={{ uuid }}>
      [EDIT]
    </StyledLink>
  )
}
