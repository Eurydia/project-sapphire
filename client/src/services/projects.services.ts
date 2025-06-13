import type { Project } from '@/types/Project'
import { QueryClient } from '@tanstack/react-query'

export class ProjectsService {
  private readonly API_HOST = import.meta.env.VITE_API_HOST
  private readonly API_PORT: string = import.meta.env.VITE_API_PORT
  private readonly API = `${this.API_HOST}:${this.API_PORT}`

  private readonly Q_CLIENT = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
  })

  public async getAll() {
    console.debug(this.API)
    const projects = await this.Q_CLIENT.fetchQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        const res = await fetch(`${this.API}/projects`)
        if (!res.ok) {
          throw new Error(
            `Failed to fetch projects: ${res.status} ${res.statusText}`,
          )
        }
        return res.json() as Promise<Array<Project>>
      },
    })
    return projects
  }
}
