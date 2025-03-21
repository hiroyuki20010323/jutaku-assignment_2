import { z } from 'zod'
import { router } from '~/lib/trpc/trpc'
import { userProcedure, adminProcedure } from '../middleware'
import { TRPCError } from '@trpc/server'
import { projectRepository } from '../repository/project'

export const projectRouter = router({
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
  })
})
