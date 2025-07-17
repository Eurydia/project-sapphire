import { topicSchema } from "~/models/topics/topic";

export const listTopic = () =>
  window.db$topic
    .getAll()
    .then(topicSchema.array().parseAsync)
    .catch(() => []);
