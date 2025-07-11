import { In } from 'typeorm'
import { APP_DATA_SOURCE } from '../data-source'
import { Topic } from '../models/topic.entity'

const REPO = APP_DATA_SOURCE.getRepository(Topic)

type CreateDto = {
  name: string
  color?: string
}

export const createTopic = async ({ name, color }: CreateDto) => {
  const entry = REPO.create({ name, color })
  return REPO.save(entry)
}
export const createManyTopic = async (names: string[]) => {
  const existing = await REPO.findBy({
    name: In(names),
  })
  const existingSet = new Set(existing.map(({ name }) => name))

  const novel = names.filter((name) => !existingSet.has(name))
  const requests = novel.map((name) => REPO.save(REPO.create({ name })))
  return await Promise.all(requests)
}

export const getAllTopic = async () => {
  return REPO.find()
}
