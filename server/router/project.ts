import { z } from 'zod'
import { router } from '~/lib/trpc/trpc'
import { userProcedure } from '../middleware'
import { TRPCError } from '@trpc/server'
import { projectRepository } from '../repository/project'

// エントリー用の入力スキーマを定義（プロジェクトIDのみ必要）
const entryInputSchema = z.object({
  projectId: z.string()
})

export type ProjectEntryInput = {
  projectId: string
  userId: string
}

// Zodスキーマから型を抽出
export type EntryInput = z.infer<typeof entryInputSchema>

export const projectRouter = router({
  // ユーザー用案件一覧
  list: userProcedure.query(async () => {
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

  // 単一プロジェクト取得（ID指定）
  findById: userProcedure.input(z.string()).query(async ({ input }) => {
    const project = await projectRepository.findById(input)

    if (!project) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'お探しのプロジェクトは見つかりませんでした'
      })
    }

    return {
      id: project.id,
      title: project.title,
      summary: project.summary,
      deadline: project.deadline,
      unitPrice: project.unitPrice,
      createdAt: project.createdAt,
      skills: project.skillRequirements.map((req) => ({
        id: req.skill.id,
        name: req.skill.skillName
      }))
    }
  }),

  // ユーザーがエントリーしたプロジェクト一覧
  entryList: userProcedure.query(async ({ ctx }) => {
    const { userId } = ctx
    return await projectRepository.findUserEntries(userId)
  }),

  // プロジェクトへのエントリー
  entry: userProcedure
    .input(entryInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { projectId } = input
      const userId = ctx.userId

      try {
        const entryData = { projectId, userId }
        await projectRepository.entry(entryData)

        return {
          success: true,
          message: 'エントリーが完了しました'
        }
      } catch (error) {
        console.error('エントリー作成エラー:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'エントリーの作成に失敗しました'
        })
      }
    })
})
