import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type UserState = {
  user: User | null
}
type UserAction = {
  setUser: (user: UserState['user']) => void
}
// stateの定義と更新ロジックを含むストアを作成。
export const useUserStore = create<UserState & UserAction>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))


type Project =  {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  deadline: Date;
  unitPrice: number;
}

type EditProjectStore = {
  project: Project | null;
  setProject: (project: Project) => void;
  clearProject: () => void;
}

export const useEditProjectStore = create<EditProjectStore>()(
  persist(
    (set) => ({
      project: null,
      setProject: (project) => set({ project }),
      clearProject: () => set({ project: null }),
    }),
    {
      name: 'edit-project-storage',
    }
  )
);