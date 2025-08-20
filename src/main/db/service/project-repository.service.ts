import { projectRepositoryCreateDtoSchema } from "#/models/project-repository/dto/create"
import { projectRepositoryUpdateDtoSchema } from "#/models/project-repository/dto/update"
import { registerIpcMainServices } from "@/services/core"
import { EntityNotFoundError } from "typeorm"
import { AppDataSource } from "../data-source"
import { ProjectRepositoryEntity } from "../entities/project-repository.entity"
import { ProjectEntity } from "../entities/project.entity"

const add = (arg: unknown) => {
  const { projectUUID, ...dto } =
    projectRepositoryCreateDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const projectRepo = mgr.getRepository(ProjectEntity)
    const projectRepoRepo = mgr.getRepository(
      ProjectRepositoryEntity,
    )

    const projectEntity = await projectRepo.preload({
      uuid: projectUUID,
    })

    if (projectEntity === undefined) {
      throw new EntityNotFoundError(ProjectEntity, {
        uuid: projectUUID,
      })
    }

    console.debug(projectEntity.repositories)
    projectEntity.repositories = [
      ...(projectEntity.repositories ?? []),
      projectRepoRepo.create(dto),
    ]

    return projectRepo.save(projectEntity)
  })
}

const update = async (arg: unknown) => {
  const { projectUUID, uuid, ...dto } =
    projectRepositoryUpdateDtoSchema.parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const repo = mgr.getRepository(ProjectRepositoryEntity)
    const entity = await repo.findOneOrFail({
      where: { uuid: uuid, project: { uuid: projectUUID } },
    })
    return repo.save(repo.merge(entity, dto))
  })
}

registerIpcMainServices("db$project-repository", {
  add,
  update,
})
