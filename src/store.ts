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
  skills: string[]
  deadline: Date
  unitPrice: number
  createdAt: Date
}

type CreateProjectStore = {
  projects: Project[]
  addProject: (project: Project) => void
}

type EditProjectStore = {
  project: Project | null
  setProject: (project: Project) => void
  clearProject: () => void
}

// stateの定義と更新ロジックを含むストアを作成。
export const useUserStore = create<UserState & UserAction>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))

export const useEditProjectStore = create<EditProjectStore>()(
  persist(
    (set) => ({
      project: null,
      setProject: (project) => set({ project }),
      clearProject: () => set({ project: null })
    }),
    {
      name: 'edit-project-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

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
      name: 'create-project-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
