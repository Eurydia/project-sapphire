import type { CreateProjectDto } from "@/types/projects/dto/create-project.dto";
import type { Project, ProjectQuery } from "@/types/projects/project.entity";
import axios from "axios";

export class ProjectService {
  private static readonly CLIENT = axios.create({
    baseURL: `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`,
  });

  public static async findAll() {
    const projects = this.CLIENT.get<Project[]>(`/projects`).then(
      (res) => res.data,
      (): Project[] => [],
    );
    return projects;
  }

  public static async find(id: string) {
    return this.CLIENT.get<Project>(`/projects/${id}`)
      .then((res) => res.data)
      .catch(() => null);
  }

  public static async create(dto: CreateProjectDto) {
    return await this.CLIENT.post<Project>(`/projects`, dto).then(
      (res) => res.data,
    );
  }

  public static async delete(id: string) {
    console.debug(id);
    return await this.CLIENT.delete(`/projects/${id}`);
  }
}

export class ProjectQueryBuilder {
  private name: string | undefined;
  private technologies: string[] | undefined;
  private topics: string[] | undefined;
  private status: string | undefined;
  private visibility: string | undefined;

  public withName(value: typeof this.name) {
    this.name = value;
    return this;
  }

  public withTechnologies(value: typeof this.technologies) {
    this.technologies = value;
    return this;
  }

  public withTopics(value: typeof this.topics) {
    this.topics = value;
    return this;
  }

  public withStatus(value: typeof this.status) {
    this.status = value;
    return this;
  }
  public withVisibility(value: typeof this.visibility) {
    this.visibility = value;
    return this;
  }

  public build(): ProjectQuery {
    return {
      name: this.name,
      technologies: this.technologies,
      topics: this.topics,
      status: this.status,
      visibility: this.visibility,
    };
  }
}
