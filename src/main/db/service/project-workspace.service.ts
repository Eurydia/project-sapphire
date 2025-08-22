import { projectWorkspaceCreateDtoSchema } from "#/models/project-workspace/dto/create"
import { projectWorkspaceUpdateDtoSchema } from "#/models/project-workspace/dto/update"
import { registerIpcMainServices } from "@/services/core"
import { EntityNotFoundError } from "typeorm"
import { z } from "zod/v4"
import { AppDataSource } from "../data-source"
import { ProjectWorkspaceEntity } from "../entities/project-workspace.entity"
import { ProjectEntity } from "../entities/project.entity"

const add = (arg: unknown) => {
  const { projectUUID, ...dto } =
    projectWorkspaceCreateDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const projectRepo = mgr.getRepository(ProjectEntity)
    const wsRepo = mgr.getRepository(ProjectWorkspaceEntity)

    const entity = await projectRepo.findOneOrFail({
      where: { uuid: projectUUID },
    })
    if (entity === undefined) {
      throw new EntityNotFoundError(ProjectEntity, {
        uuid: projectUUID,
      })
    }
    const wsEntity = await wsRepo.save(
      wsRepo.create({ ...dto, project: { uuid: projectUUID } }),
    )

    entity.workspaces = [...(entity.workspaces ?? []), wsEntity]

    return projectRepo.save(entity)
  })
}

const update = async (arg: unknown) => {
  const { projectUUID, uuid, ...dto } =
    projectWorkspaceUpdateDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const repo = mgr.getRepository(ProjectWorkspaceEntity)
    const entity = await repo.findOneOrFail({
      where: { uuid: uuid, project: { uuid: projectUUID } },
    })

    return repo.save({ ...entity, ...dto })
  })
}

const deleteByUUID = async (arg: unknown) => {
  const uuid = z.uuidv4().parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const repo = mgr.getRepository(ProjectWorkspaceEntity)
    return repo.delete({ uuid })
  })
}

registerIpcMainServices("db$project-workspace", {
  add,
  update,
  deleteByUUID,
})
