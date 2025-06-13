import type { CreateProjectDto } from "@/types/projects/dto/create-project.dto";
import type { Project, ProjectQuery } from "@/types/projects/project.entity";
import axios from "axios";

export class ProjectsService {
  private static readonly API_HOST = import.meta.env.VITE_API_HOST;
  private static readonly API_PORT: string = import.meta.env.VITE_API_PORT;
  private static readonly API = `${this.API_HOST}:${this.API_PORT}`;

  public static async findAll() {
    const projects = await axios
      .get<Project[]>(`http://localhost:8081/projects`)
      .then(
        (res) => res.data,
        (err) => {
          console.warn(err);
          return [];
        },
      );
    return projects;
  }

  public static async create(dto: CreateProjectDto) {
    return await axios
      .post<Project>("http://localhost:8081/projects", dto)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.response) {
          console.error("Response:", err);
        } else {
          console.error("Error:", err);
        }
        return null;
      });
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
