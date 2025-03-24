import { z } from 'zod'
import { router } from '~/lib/trpc/trpc'
import { adminProcedure } from '../middleware'
import { projectRepository } from '../repository/project'
import { TRPCError } from '@trpc/server'
import { prisma } from '~/prisma/prismaClient'
import { editProjectSchema, createProjectSchema } from '~/schema/project'
import { adminProjectRepository } from '../repository/adminProject'

const entryInputSchema = z.object({
  projectId: z.string(),
  userId: z.string()
})

const editProjectInputSchema = z.object({
  projectId: z.string(),
  projectData: editProjectSchema
})

export type EntryInput = z.infer<typeof entryInputSchema>
export type EditProjectWithIdInput = z.infer<typeof editProjectInputSchema>

export const adminProjectRouter = router({
  // 案件詳細
  findById: adminProcedure.input(z.string()).query(async ({ input }) => {
    const project = await projectRepository.findById(input)

    if (!project) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'お探しのプロジェクトは見つかりませんでした'
      })
    }

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
      entryUsers
    }
  }),

  // 案件編集
  edit: adminProcedure
    .input(editProjectInputSchema)
    .mutation(async ({ input }) => {
      const { projectId, projectData } = input

      try {
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
            const skill =
              await adminProjectRepository.findSkillByName(skillName)

            if (!skill) {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'スキル情報がありません'
              })
            }
            return skill.id
          })
        )

        const { project, skills } = await adminProjectRepository.updateProject(
          projectId,
          projectData,
          skillIds
        )

        return {
          id: project.id,
          title: project.title,
          summary: project.summary,
          deadline: project.deadline,
          unitPrice: project.unitPrice,
          skills: skills.map((skill) => ({
            id: skill.id,
            name: skill.skillName
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

  // プロジェクト作成
  create: adminProcedure
    .input(createProjectSchema)
    .mutation(async ({ input }) => {
      try {
        const skillIds = await Promise.all(
          input.skills.map(async (skillName) => {
            const skill =
              await adminProjectRepository.findSkillByName(skillName)
            if (!skill) {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'スキル情報がありません'
              })
            }
            return skill.id
          })
        )

        await adminProjectRepository.createProject(input, skillIds)

        return {
          success: true,
          message: 'プロジェクトが作成されました'
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
        const existingProject = await projectRepository.findById(projectId)
        if (!existingProject) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '削除するプロジェクトが見つかりませんでした'
          })
        }

        await prisma.skillRequirement.deleteMany({
          where: { projectId }
        })

        await prisma.projectEntry.deleteMany({
          where: { projectId }
        })

        await prisma.project.delete({
          where: { id: projectId }
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
