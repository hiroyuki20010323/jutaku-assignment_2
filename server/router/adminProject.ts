import { z } from 'zod'
import { router } from '~/lib/trpc/trpc'
import { adminProcedure } from '../middleware'
import { projectRepository } from '../repository/project'
import { TRPCError } from '@trpc/server'
import { prisma } from '~/prisma/prismaClient'

// エントリー用の入力スキーマを定義
const entryInputSchema = z.object({
  projectId: z.string(),
  userId: z.string()
})

// Zodスキーマから型を抽出
export type EntryInput = z.infer<typeof entryInputSchema>

export const adminProjectRouter = router({
  // 管理者用案件一覧取得
  list: adminProcedure.query(async () => {
    const projects = await projectRepository.findMany()

    return projects.map((project) => ({
      id: project.id,
      title: project.title,
      summary: project.summary,
      createdAt: project.createdAt,
      skills: project.skillRequirements.map((req) => ({
        id: req.skill.id,
        name: req.skill.skillName
      }))
    }))
  }),
  // 案件詳細
  findById: adminProcedure.input(z.string()).query(async ({ input }) => {
    const project = await projectRepository.findById(input)

    if (!project) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'お探しのプロジェクトは見つかりませんでした'
      })
    }

    // プロジェクトにエントリーしたユーザー情報を取得
    const entryUsers = await projectRepository.findEntryUsers(input)

    return {
      id: project.id,
      title: project.title,
      summary: project.summary,
      deadline: project.deadline,
      unitPrice: project.unitPrice,
      skills: project.skillRequirements.map((req) => ({
        id: req.skill.id,
        name: req.skill.skillName
      })),
      entryUsers // エントリーユーザー情報を追加
    }
  })
})
