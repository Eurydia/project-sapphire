import { projectRepositoryCreateDtoSchema } from "#/models/project-repository/dto/create"
import { projectRepositoryUpdateDtoSchema } from "#/models/project-repository/dto/update"
import { registerIpcMainServices } from "@/services/core"
import { z } from "zod/v4"
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

    const entity = await projectRepo.findOneOrFail({
      where: { uuid: projectUUID },
    })

    const repoEntity = await projectRepoRepo.save(
      projectRepoRepo.create({
        ...dto,
        project: { uuid: projectUUID },
      }),
    )

    entity.repositories = [
      ...(entity.repositories ?? []),
      repoEntity,
    ]

    return projectRepo.save(entity)
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
    return repo.save({ ...entity, ...dto })
  })
}

const deleteByUUID = async (arg: unknown) => {
  const uuid = z.uuidv4().parse(arg)
  return AppDataSource.transaction(async (mgr) => {
    const repo = mgr.getRepository(ProjectRepositoryEntity)
    return repo.delete({ uuid })
  })
}

registerIpcMainServices("db$project-repository", {
  add,
  update,
  deleteByUUID,
})
