import type { z } from "zod/v4";
import { projectDtoSchema } from "./create-project";

export const updateProjectDtoSchema = projectDtoSchema;
export type UpdateProjectDto = z.infer<typeof updateProjectDtoSchema>;
