import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const handler = async () => {
    console.debug(await window.db.ping())
  }

  return (
    <div className="text-center">
      <button onClick={handler}>aa</button>
    </div>
  )
}
