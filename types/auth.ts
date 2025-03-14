import { z } from 'zod'
import { loginSchema } from '~/schema/auth'


export type LoginFormValues = z.infer<typeof loginSchema>