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


export const createProjectSchema = z.object({
  title: z.string().min(1, '案件名は必須です'),
  summary: z.string().min(1, '概要は必須です'),
  skills: z.array(z.string()).min(1, '少なくとも1つのスキルを選択してください'),
  deadline: z.date({
    required_error: '締切日は必須です',
    invalid_type_error: '有効な日付を入力してください'
  }),
  unitPrice: z.number().min(1, '単価は必須です')
})