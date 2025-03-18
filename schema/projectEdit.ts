import { z } from 'zod'

export const editProjectSchema = z.object({
  title: z.string().min(1, '件名を入力してください'),
  summary: z.string().min(1, '概要を入力してください'),
  skills: z.array(z.string()).min(1, '必要なスキルを1つ以上選択してください'),
  deadline: z.date({
    required_error: '応募締切日を入力してください'
  }),
  unitPrice: z
    .number({
      required_error: '単価を入力してください'
    })
    .min(0, '0以上の数値を入力してください')
})
