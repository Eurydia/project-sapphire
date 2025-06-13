import { ProjectsService } from '@/services/projects.services'

export class ProjectController {
  private static readonly projectsSvc = new ProjectsService()

  public static async Index() {
    const projects = await this.projectsSvc.getAll()
    const projectCount = projects.length
    let projectCountMsg = ''
    if (projectCount <= 1) {
      projectCountMsg = `Showing ${projects.length} item`
    } else {
      projectCountMsg = `Showing ${projects.length} items`
    }
    return { projects, projectCountMsg, projectCount }
  }
}
