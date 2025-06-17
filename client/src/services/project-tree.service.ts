import type { ProjectTree } from "@/types/project-tree/project-tree.entity";
import axios from "axios";

export class ProjectTreeService {
  private static readonly CLIENT = axios.create({
    baseURL: `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`,
  });

  static getTree(projectUUID: string, path: string = "") {
    return this.CLIENT.get<ProjectTree>(`projects/${projectUUID}/tree/${path}`)
      .then((res) => res.data)
      .catch(() => null);
  }
}
