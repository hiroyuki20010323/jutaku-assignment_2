import { z } from 'zod'

// ログイン画面のスキーマ
export const signInSchema = z.object({
  email: z.string().email({ message: '無効なメールアドレスです' }),
  password: z.string().min(1, { message: 'パスワードは必須です' })
})

// サインアップ用のZodスキーマ
export const signupSchema = z
  .object({
    email: z.string().email({ message: '無効なメールアドレスです' }),
    name: z.string().min(1, { message: 'お名前は必須です' }),
    password: z.string().min(1, { message: 'パスワードは必須です' }),
    confirmPassword: z
      .string()
      .min(1, { message: '確認用パスワードは必須です' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword']
  })
