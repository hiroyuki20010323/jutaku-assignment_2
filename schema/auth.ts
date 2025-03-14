import { z } from 'zod'

// 管理者・ユーザ関係なくログイン画面のスキーマ
export const signInSchema = z.object({
  email: z.string().email({ message: '無効なメールアドレスです' }),
  password: z.string().min(1, { message: 'パスワードは必須です' })
})
