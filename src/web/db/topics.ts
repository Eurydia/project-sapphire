import { topicSchema } from "~/models/topics/topic";

export const fetchTopicAll = () =>
  window.db.Topic.getAll()
    .then((resp) => topicSchema.array().parseAsync(resp))
    .catch(() => []);
