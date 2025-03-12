import { PrismaClient } from '@prisma/client'
import { ADMIN_USER, USERS, PROJECTS, SKILLS } from './dummyData'

const prisma = new PrismaClient()

async function main() {
  console.log('シードデータの登録を開始します...')

  // トランザクションを使用してすべての操作を実行
  await prisma.$transaction(async (tx) => {
    console.log('既存データを削除中...')
    await tx.skillRequirement.deleteMany({})
    await tx.projectEntry.deleteMany({})
    await tx.skill.deleteMany({})
    await tx.project.deleteMany({})
    await tx.user.deleteMany({})

    // 管理者ユーザーの登録
    console.log('管理者ユーザーを登録中...')
    const adminUser = await tx.user.create({
      data: ADMIN_USER
    })

    // 一般ユーザーの登録
    console.log('一般ユーザーを登録中...')
    const createdUsers = await Promise.all(
      USERS.map((user) =>
        tx.user.create({
          data: user
        })
      )
    )

    // プロジェクトの登録
    console.log('プロジェクトを登録中...')
    const createdProjects = await Promise.all(
      PROJECTS.map((project) =>
        tx.project.create({
          data: project
        })
      )
    )

    // スキルの登録
    console.log('スキルを登録中...')
    const createdSkills = await Promise.all(
      SKILLS.map((skill) =>
        tx.skill.create({
          data: skill
        })
      )
    )

    // プロジェクトエントリーの登録
    console.log('プロジェクトエントリーを登録中...')
    const projectEntries = [
      // 山田太郎をECサイトプロジェクトに割り当て
      {
        userId: createdUsers[0].id,
        projectId: createdProjects[0].id
      },
      // 佐藤花子を管理システムプロジェクトに割り当て
      {
        userId: createdUsers[1].id,
        projectId: createdProjects[1].id
      },
      // 鈴木一郎をモバイルアプリプロジェクトに割り当て
      {
        userId: createdUsers[2].id,
        projectId: createdProjects[2].id
      }
    ]

    await Promise.all(
      projectEntries.map((entry) =>
        tx.projectEntry.create({
          data: entry
        })
      )
    )

    // スキル要件の登録
    console.log('スキル要件を登録中...')
    const skillRequirements = [
      // ECサイトプロジェクトにReactを要求
      {
        projectId: createdProjects[0].id,
        skillId: createdSkills[0].id
      },
      // 管理システムプロジェクトにNext.jsを要求
      {
        projectId: createdProjects[1].id,
        skillId: createdSkills[1].id
      },
      // モバイルアプリプロジェクトにAWSを要求
      {
        projectId: createdProjects[2].id,
        skillId: createdSkills[2].id
      }
    ]

    await Promise.all(
      skillRequirements.map((req) =>
        tx.skillRequirement.create({
          data: req
        })
      )
    )
  })

  console.log('シードデータの登録が完了しました！')
}

main()
  .catch((e) => {
    console.error('エラーが発生しました:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
