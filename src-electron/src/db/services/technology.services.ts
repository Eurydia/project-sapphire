import { In } from 'typeorm'
import { APP_DATA_SOURCE } from '../data-source'
import { Technology } from '../models/technology.entity'

const REPO = APP_DATA_SOURCE.getRepository(Technology)

type CreateDto = {
  name: string
  color?: string
}

export const createTech = async ({ name, color }: CreateDto) => {
  const entry = REPO.create({ name, color })
  return REPO.save(entry)
}
export const createManyTech = async (names: string[]) => {
  const existing = await REPO.findBy({
    name: In(names),
  })
  const existingSet = new Set(existing.map(({ name }) => name))

  const novel = names.filter((name) => !existingSet.has(name))
  const requests = novel.map((name) => REPO.save(REPO.create({ name })))
  return Promise.all(requests)
}

export const getAllTech = async () => {
  return REPO.find()
}
