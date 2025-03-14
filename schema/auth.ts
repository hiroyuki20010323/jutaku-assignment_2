import { z } from 'zod'

// 管理者・ユーザ関係なくログイン画面のスキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('正しいメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードは必須です'),
})