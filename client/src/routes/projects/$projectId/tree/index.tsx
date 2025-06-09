import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/tree/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$projectId/tree/"!</div>
}
