import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/blob/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$projectId/blob/"!</div>
}
