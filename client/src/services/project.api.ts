import type { Project } from '@/types/Project'
import { faker } from '@faker-js/faker'

export const getProject = async (id: string) => {
  return {
    id,
    name: faker.lorem.word(),
    description: faker.lorem.lines(),
    tags: faker.lorem.words(100).split(' '),
  } as Project
}

export const getProjectAll = async () => {
  return await Promise.all(
    faker.helpers.multiple(() => getProject(faker.string.uuid())),
  )
}
