import { API_CLIENT } from './client'
import { technologySchema } from '@/models/technologies/technologies'

export const fetchTechnologyAll = () =>
  API_CLIENT.get('/technologies')
    .then(technologySchema.array().parseAsync)
    .catch(() => [])
