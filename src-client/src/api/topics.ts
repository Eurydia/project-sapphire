import { API_CLIENT } from './client'
import { topicSchema } from '@/models/topics/topic'

export const fetchTopicAll = () =>
  API_CLIENT.get('/topics')
    .then(topicSchema.array().parseAsync)
    .catch(() => [])
