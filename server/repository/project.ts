import { prisma } from '~/prisma/prismaClient'

export type ProjectListType = {
  id: string
  title: string
  summary: string
  createdAt: Date
  skillRequirements: {
    skill: {
      id: string
      skillName: string
    }
  }[]
}

export const projectRepository = {
  async findMany(): Promise<ProjectListType[]> {
    return prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        summary: true,
        createdAt: true,
        skillRequirements: {
          select: {
            skill: {
              select: {
                id: true,
                skillName: true
              }
            }
          }
        }
      }
    })
  }
}
