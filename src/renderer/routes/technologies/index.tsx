import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/technologies/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/technoloies/"!</div>
}
