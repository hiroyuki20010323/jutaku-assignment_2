import type { z } from 'zod'
import type { loginSchema } from '~/schema/auth'

export type LoginFormValues = z.infer<typeof loginSchema>
