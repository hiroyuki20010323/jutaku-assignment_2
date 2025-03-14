import type { z } from 'zod'
import type { signInSchema } from '~/schema/auth'

export type SignInFormData = z.infer<typeof signInSchema>
