import type { z } from 'zod'
import type { createProjectSchema, editProjectSchema } from '~/schema/project'

// プロジェクト編集用のzod型
export type EditProjectInput = z.infer<typeof editProjectSchema>
// 作成用
export type CreateProjectInput = z.infer<typeof createProjectSchema>

// テストデータ用の型
export type TestProject = {
  id: string
  title: string
  summary: string
  deadline: Date
  unitPrice: number
  skills: {
    id: string
    name: string
  }[]
  createdAt: Date
  entryUsers: {
    id: string
    username: string
  }[]
}

// zustandでローカルストレージ保存する時に都合の良い型
export type Project = {
  id: string
  title: string
  summary: string
  skills: { id: string; name: string }[]
  deadline: Date
  createdAt?: Date
  unitPrice: number
  entryUsers?: { id: string; username: string }[]
}

export type CreateProjectStore = {
  projects: Project[]
  addProject: (project: Project) => void
}

export type EditProjectStore = {
  projectData: Project | null
  setProject: (project: Project) => void
  clearProject: () => void
}
