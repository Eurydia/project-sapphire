import { topicSchema } from "~/models/topics/topic";

export const fetchTopicAll = () =>
  window.db$topic
    .getAll()
    .then((resp) => topicSchema.array().parseAsync(resp))
    .catch(() => []);
