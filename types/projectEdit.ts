import type { z } from 'zod'
import type { editProjectSchema } from '~/schema/projectEdit'

export type EditProjectInput = z.infer<typeof editProjectSchema>
