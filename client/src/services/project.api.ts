import { type Project } from '@/types/Project'
import { faker } from '@faker-js/faker'

export const getProject = async (id: string): Promise<Project> => {
  return {
    id,
    name: faker.lorem.word(), // single random word
    description: faker.lorem.sentence(), // one random sentence
    updatedAt: faker.date.recent().toISOString(), // recent ISO timestamp
    createdAt: faker.date.past().toISOString(),
    tags: {
      technologies: faker.lorem.words(3).split(' '), // array of 3 fake technology names
      topics: faker.lorem.words(3).split(' '), // array of 3 fake topic names
      status: faker.lorem.word(), // random ProjectStatus enum
      visibility: faker.lorem.word(), // random ProjectVisibility enum
    },
  } as Project
}

export const getProjectAll = async () => {
  return await Promise.all(
    faker.helpers.multiple(() => getProject(faker.string.uuid()), {
      count: 20,
    }),
  )
}
