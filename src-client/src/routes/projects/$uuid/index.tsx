import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$uuid/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$uuid/"!</div>
}
