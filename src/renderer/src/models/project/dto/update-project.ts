import { createProjectDtoSchema } from './create-project'
import type { z } from 'zod/v4'

export const updateProjectDtoSchema = createProjectDtoSchema
export type UpdateProjectDto = z.infer<typeof updateProjectDtoSchema>
