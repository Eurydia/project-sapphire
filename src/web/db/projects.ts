import type { ZodError } from "zod/v4";
import {
  createProjectDtoSchema,
  type CreateProjectDto,
} from "~/models/project/dto/create-project";
import { projectSchema } from "~/models/project/project";

export const fetchProjectAll = async () => {
  return window.db.Project.getAll()
    .then(projectSchema.array().parseAsync)
    .catch((err: ZodError) => {
      console.debug(String(err));
      return [];
    });
};

// export const fetchProject = (uuid: string) =>
//   API_CLIENT.get(`/projects/${uuid}`)
//     .then(({ data }) => projectSchema.nullable().parseAsync(data))
//     .catch(() => null);

export const postProject = (dto: CreateProjectDto) =>
  window.db.Project.create(dto)
    .then(createProjectDtoSchema.parseAsync)
    .catch((err) => {
      console.debug(err);
      throw err;
    });

// export const putProject = (uuid: string, dto: UpdateProjectDto) =>
//   API_CLIENT.put(`/projects/${uuid}`, dto);

export const pinProject = (uuid: string) => window.db.Project.pin(uuid);

export const unpinProject = (uuid: string) => window.db.Project.unpin(uuid);
