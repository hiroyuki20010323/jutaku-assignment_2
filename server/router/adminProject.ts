import { z } from 'zod'
import { router } from '~/lib/trpc/trpc'
import { adminProcedure } from '../middleware'
import { projectRepository } from '../repository/project'
import { TRPCError } from '@trpc/server'
import { prisma } from '~/prisma/prismaClient'
import { editProjectSchema, createProjectSchema } from '~/schema/project'

// エントリー用の入力スキーマを定義
const entryInputSchema = z.object({
  projectId: z.string(),
  userId: z.string()
})

// プロジェクト編集用の入力スキーマ
const editProjectInputSchema = z.object({
  projectId: z.string(),
  projectData: editProjectSchema
})

// Zodスキーマから型を抽出
export type EntryInput = z.infer<typeof entryInputSchema>
export type EditProjectWithIdInput = z.infer<typeof editProjectInputSchema>

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
  }),

  edit: adminProcedure
    .input(editProjectInputSchema)
    .mutation(async ({ input }) => {
      const { projectId, projectData } = input

      try {
        // プロジェクトの存在確認
        const existingProject = await projectRepository.findById(projectId)
        if (!existingProject) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '更新するプロジェクトが見つかりませんでした'
          })
        }

        // スキル情報の処理
        const skillIds = await Promise.all(
          projectData.skills.map(async (skillName) => {
            // 既存のスキルを検索
            let skill = await prisma.skill.findFirst({
              where: { skillName }
            })

            // 存在しない場合は新規作成
            if (!skill) {
              skill = await prisma.skill.create({
                data: { skillName }
              })
            }

            return skill.id
          })
        )

        // トランザクション内でプロジェクトの更新とスキル要件の更新を行う
        const updatedProject = await prisma.$transaction(async (tx) => {
          // プロジェクト自体の更新
          const project = await tx.project.update({
            where: { id: projectId },
            data: {
              title: projectData.title,
              summary: projectData.summary,
              deadline: projectData.deadline,
              unitPrice: projectData.unitPrice,
              updatedAt: new Date()
            },
            include: {
              skillRequirements: {
                include: {
                  skill: true
                }
              }
            }
          })

          // 既存のスキル要件を削除
          await tx.skillRequirement.deleteMany({
            where: { projectId }
          })

          // 新しいスキル要件を作成
          await Promise.all(
            skillIds.map((skillId) =>
              tx.skillRequirement.create({
                data: {
                  projectId,
                  skillId
                }
              })
            )
          )

          return project
        })

        return {
          id: updatedProject.id,
          title: updatedProject.title,
          summary: updatedProject.summary,
          deadline: updatedProject.deadline,
          unitPrice: updatedProject.unitPrice,
          skills: updatedProject.skillRequirements.map((req) => ({
            id: req.skill.id,
            name: req.skill.skillName
          }))
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }

        console.error('プロジェクト更新エラー:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクトの更新に失敗しました'
        })
      }
    }),

  create: adminProcedure
    .input(createProjectSchema)
    .mutation(async ({ input }) => {
      try {
        // スキル情報の処理
        const skillIds = await Promise.all(
          input.skills.map(async (skillName) => {
            // 既存のスキルを検索
            let skill = await prisma.skill.findFirst({
              where: { skillName }
            })

            // 存在しない場合は新規作成
            if (!skill) {
              skill = await prisma.skill.create({
                data: { skillName }
              })
            }

            return skill.id
          })
        )

        // トランザクション内でプロジェクトの作成とスキル要件の作成を行う
        const createdProject = await prisma.$transaction(async (tx) => {
          // プロジェクト自体の作成
          const project = await tx.project.create({
            data: {
              title: input.title,
              summary: input.summary,
              deadline: input.deadline,
              unitPrice: input.unitPrice,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })

          // スキル要件を作成
          await Promise.all(
            skillIds.map((skillId) =>
              tx.skillRequirement.create({
                data: {
                  projectId: project.id,
                  skillId
                }
              })
            )
          )

          return project
        })

        return {
          id: createdProject.id,
          title: createdProject.title,
          summary: createdProject.summary,
          deadline: createdProject.deadline,
          unitPrice: createdProject.unitPrice,
          skills: skillIds
        }
      } catch (error) {
        console.error('プロジェクト作成エラー:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクトの作成に失敗しました'
        })
      }
    }),

  // プロジェクト削除
  delete: adminProcedure
    .input(z.string())
    .mutation(async ({ input: projectId }) => {
      try {
        // プロジェクトの存在確認
        const existingProject = await projectRepository.findById(projectId)
        if (!existingProject) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '削除するプロジェクトが見つかりませんでした'
          })
        }

        // トランザクション内でスキル要件とプロジェクトを削除
        await prisma.$transaction(async (tx) => {
          // 関連するスキル要件を削除
          await tx.skillRequirement.deleteMany({
            where: { projectId }
          })

          // 関連するエントリー情報を削除
          await tx.projectEntry.deleteMany({
            where: { projectId }
          })

          // プロジェクト自体を削除
          await tx.project.delete({
            where: { id: projectId }
          })
        })

        return { success: true, message: 'プロジェクトを削除しました' }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }

        console.error('プロジェクト削除エラー:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクトの削除に失敗しました'
        })
      }
    })
})
