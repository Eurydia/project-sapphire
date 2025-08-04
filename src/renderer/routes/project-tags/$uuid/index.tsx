import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/project-tags/$uuid/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/project-tags/uuid/"!</div>
}
