import { prisma } from '~/prisma/prismaClient'
import type { editProjectSchema, createProjectSchema } from '~/schema/project'
import type { z } from 'zod'
import type { Project, Skill } from '@prisma/client'

export type ProjectSkill = {
  id: string
  name: string
}

export type ProjectWithSkills = {
  id: string
  title: string
  summary: string
  deadline: Date
  unitPrice: number
  skills: ProjectSkill[]
}

export type EditProjectSchema = z.infer<typeof editProjectSchema>
export type CreateProjectSchema = z.infer<typeof createProjectSchema>

export const adminProjectRepository = {
  // プロジェクト更新
  async updateProject(
    projectId: string,
    projectData: EditProjectSchema,
    skillIds: string[]
  ): Promise<{
    project: Project
    skills: Skill[]
  }> {
    const updatedProject = await prisma.project.update({
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

    await prisma.skillRequirement.deleteMany({
      where: { projectId }
    })

    await Promise.all(
      skillIds.map((skillId) =>
        prisma.skillRequirement.create({
          data: {
            projectId,
            skillId
          }
        })
      )
    )

    return {
      project: updatedProject,
      skills: await prisma.skill.findMany({
        where: { id: { in: skillIds } }
      })
    }
  },

  // プロジェクト作成
  async createProject(
    projectData: CreateProjectSchema,
    skillIds: string[]
  ): Promise<void> {
    const project = await prisma.project.create({
      data: {
        title: projectData.title,
        summary: projectData.summary,
        deadline: projectData.deadline,
        unitPrice: projectData.unitPrice,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await Promise.all(
      skillIds.map((skillId) =>
        prisma.skillRequirement.create({
          data: {
            projectId: project.id,
            skillId
          }
        })
      )
    )
  },

  async findSkillByName(skillName: string) {
    return await prisma.skill.findFirst({
      where: { skillName }
    })
  }
}
