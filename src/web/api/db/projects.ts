import {
  projectDtoSchema,
  type ProjectDto,
} from "~/models/project/dto/create-project";
import {
  projectRootMetadataSchema,
  projectSchema,
  projectWithRootMetadataSchema,
  type Project,
} from "~/models/project/project";

export const getProjectRootMetadata = (uuid: string) =>
  window.db$project
    .getRootMetadata(uuid)
    .then(projectRootMetadataSchema.nullable().parseAsync);

export const listProject = async () =>
  window.db$project.getAll().then(projectSchema.array().parseAsync);

export const withRootMetadata = (project: Project) =>
  getProjectRootMetadata(project.uuid)
    .then((metadata) => ({
      ...project,
      metadata,
    }))
    .then(projectWithRootMetadataSchema.parseAsync);

export const postProject = (dto: ProjectDto) =>
  window.db$project.create(dto).then(projectDtoSchema.parseAsync);

// export const putProject = (uuid: string, dto: UpdateProjectDto) =>
//   API_CLIENT.put(`/projects/${uuid}`, dto);

export const pinProject = (uuid: string) => window.db$project.pin(uuid);

export const unpinProject = (uuid: string) => window.db$project.unpin(uuid);
