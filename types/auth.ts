import type { z } from 'zod'
import type { signInSchema, signupSchema } from '~/schema/auth'

export type SignInFormData = z.infer<typeof signInSchema>

export type SignupFormData = z.infer<typeof signupSchema>
