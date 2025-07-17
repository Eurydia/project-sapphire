import { z } from "zod/v4";
import {
  projectDtoSchema,
  type ProjectDto,
} from "~/models/project/dto/create-project";
import {
  projectRootMetadataSchema,
  projectSchema,
} from "~/models/project/project";

export const getProjectRootMetadata = (uuid: string) =>
  window.db$project
    .getRootMetadata(uuid)
    .then(projectRootMetadataSchema.nullable().parseAsync);

export const listProject = async () =>
  window.db$project
    .getAll()
    .then(projectSchema.array().parseAsync)
    .then((items) =>
      Promise.all(
        items.map(async (item) => ({
          ...item,
          metadata: await getProjectRootMetadata(item.uuid).catch(() => null),
        }))
      )
    )
    .catch(() => null);

export const getProjectByUuid = (uuid: string) =>
  window.db$project
    .getByUuid(uuid)
    .then(projectSchema.parseAsync)
    .then((p) => ({
      ...p,
      metadata: getProjectRootMetadata(p.uuid).catch(() => null),
    }))
    .catch(() => null);

export const createProject = (dto: ProjectDto) =>
  window.db$project.create(dto).then(projectDtoSchema.parseAsync);

export const updateProject = (uuid: string, dto: ProjectDto) =>
  window.db$project.update(uuid, dto);

export const pinProject = (uuid: string) => window.db$project.pin(uuid);

export const unpinProject = (uuid: string) => window.db$project.unpin(uuid);

export const getProjectTableShape = () =>
  window.db$project
    .getTableShape()
    .then((res) => {
      return z
        .object({
          columns: z.object({ name: z.string(), type: z.string() }).array(),
          relations: z.object({ name: z.string(), type: z.string() }).array(),
        })
        .parseAsync(res);
    })
    .catch(() => null);
