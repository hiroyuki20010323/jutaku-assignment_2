import { prisma } from '~/prisma/prismaClient'
import type { ProjectEntryInput } from '../router/project'

export type ProjectEntryListType = {
  id: string
  createdAt: Date
  project: {
    id: string
    title: string
    unitPrice: number
  }
}

export type EntryUserType = {
  id: string
  username: string
}

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

export type ProjectDetailType = {
  id: string
  title: string
  summary: string
  deadline: Date
  unitPrice: number
  createdAt: Date
  skillRequirements: {
    skill: {
      id: string
      skillName: string
    }
  }[]
}

export const projectRepository = {
  // 案件一覧
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
  },

  // 案件詳細
  async findById(id: string): Promise<ProjectDetailType | null> {
    return prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        summary: true,
        deadline: true,
        unitPrice: true,
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
  },

  // エントリー
  async entry({ projectId, userId }: ProjectEntryInput): Promise<void> {
    await prisma.projectEntry.create({
      data: {
        project: {
          connect: { id: projectId }
        },
        user: {
          connect: { id: userId }
        }
      }
    })
  },

  // ユーザーがエントリーしたプロジェクト一覧を取得
  async findUserEntries(userId: string): Promise<ProjectEntryListType[]> {
    return await prisma.projectEntry.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            title: true,
            unitPrice: true
          }
        }
      }
    })
  },

  // プロジェクトにエントリーしたユーザー一覧を取得
  async findEntryUsers(projectId: string): Promise<EntryUserType[]> {
    const projectEntries = await prisma.projectEntry.findMany({
      where: {
        projectId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return projectEntries.map((entry) => ({
      id: entry.user.id,
      username: entry.user.name
    }))
  }
}
