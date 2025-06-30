import { projectTreeSchema } from "@/types/project-tree/project-tree.entity";
import { API_CLIENT } from "./client";

export const fetchProjectTree = async (uuid: string, path: string = "") => {
  return API_CLIENT.get(`projects/${uuid}/tree/${path}`)
    .then((res) => projectTreeSchema.parseAsync(res.data))
    .catch(() => null);
};
