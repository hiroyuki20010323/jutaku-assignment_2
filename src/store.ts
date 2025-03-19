import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type UserState = {
  user: User | null
}
type UserAction = {
  setUser: (user: UserState['user']) => void
}

type Project = {
  id: string
  title: string
  summary: string
  skills: { id: string; name: string }[]
  deadline: Date
  unitPrice: number
  entryUsers?: { id: string; username: string }[]
}

type CreateProjectStore = {
  projects: Project[]
  addProject: (project: Project) => void
}

type EditProjectStore = {
  projectData: Project | null
  setProject: (project: Project) => void
  clearProject: () => void
}

// stateの定義と更新ロジックを含むストアを作成。
export const useUserStore = create<UserState & UserAction>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))

// プロジェクト編集データ保存
export const useEditProjectStore = create<EditProjectStore>()(
  persist(
    (set) => ({
      projectData: null,
      setProject: (project) => set({ projectData: project }),
      clearProject: () => set({ projectData: null })
    }),
    {
      name: 'edit-project-storage'
    }
  )
)

// プロジェクト作成データ保存
export const useCreateProjectStore = create<CreateProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project]
        }))
    }),
    {
      name: 'create-project-storage'
    }
  )
)
