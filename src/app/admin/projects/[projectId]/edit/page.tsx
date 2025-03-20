'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  TextInput,
  Textarea,
  NumberInput,
  MultiSelect,
  Button,
  Stack,
  Box,
  Title,
  Container,
  Flex,
  Text
} from '@mantine/core'
import Link from 'next/link'
import { Controller } from 'react-hook-form'
import { DateInput } from '@mantine/dates'
import { useEffect, useState } from 'react'
import { useEditProjectStore } from '@/store'
import type { EditProjectInput } from '~/types/project'
import { editProjectSchema } from '~/schema/project'
import { TESTPROJECTS } from '@/app/projects/_component/ProjectList'

// スキルリストをProject型に合わせた形式に変更
export const AVAILABLE_SKILLS = [
  { id: 'skill1', name: 'React' },
  { id: 'skill2', name: 'Next.js' },
  { id: 'skill3', name: 'AWS' },
  { id: 'skill4', name: 'Node.js' },
  { id: 'skill5', name: 'Prisma' }
]

export default function EditProject({
  params
}: { params: { projectId: string } }) {
  const { projectData, setProject } = useEditProjectStore()
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<EditProjectInput>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      title: '',
      summary: '',
      skills: [],
      deadline: new Date(),
      unitPrice: 0
    }
  })

  useEffect(() => {
    //TODO ローカルストレージからのデータ取得が非同期で、テストデータが優先されてしまうから、取得待って表示させる
    // API実装の過程でこの辺りは不要になると思われる。。。　onSubmitなども同様
    const loadData = async () => {
      setIsLoading(true)

      await new Promise((resolve) => setTimeout(resolve, 100))
      const storeState = useEditProjectStore.getState()

      if (storeState.projectData) {
        reset({
          title: storeState.projectData.title,
          summary: storeState.projectData.summary,
          skills: storeState.projectData.skills.map((skill) => skill.name),
          deadline: new Date(storeState.projectData.deadline),
          unitPrice: storeState.projectData.unitPrice
        })
      } else {
        // APIからデータを取得
        const project = TESTPROJECTS.find((p) => p.id === params.projectId)

        if (project) {
          setProject(project)

          reset({
            ...project,
            skills: project.skills.map((skill) => skill.name)
          })
        } else {
          console.error('プロジェクトが見つかりません')
        }
      }

      setIsLoading(false)
    }

    loadData()
  }, [params.projectId, reset, setProject])

  const onSubmit = async (data: EditProjectInput) => {
    try {
      const formattedSkills = data.skills.map((skillName) => {
        const existingSkill = projectData?.skills.find(
          (s) => s.name === skillName
        )

        const availableSkill = AVAILABLE_SKILLS.find(
          (s) => s.name === skillName
        )

        return (
          existingSkill ||
          availableSkill || {
            id: `skill-${crypto.randomUUID().slice(0, 8)}`,
            name: skillName
          }
        )
      })

      // 更新されたプロジェクトデータを作成
      const updatedProject = {
        ...data,
        id: params.projectId,
        skills: formattedSkills,
        updatedAt: new Date(),
        entryUsers: projectData?.entryUsers || []
      }

      setProject(updatedProject)
    } catch (error) {
      console.error('プロジェクト更新エラー:', error)
    }
  }

  return (
    <Container size="md">
      {isLoading ? (
        <div>データを読み込み中...</div>
      ) : (
        <>
          <Stack mb="xl" mt={40}>
            <Title order={2} ta="center">
              案件編集
            </Title>
            <Box>
              <Flex justify="flex-end">
                <Button
                  component={Link}
                  href="/admin/projects"
                  variant="contained"
                  color="blue"
                  w={100}
                >
                  戻る
                </Button>
              </Flex>
            </Box>
          </Stack>

          <Box
            p="xl"
            style={{ border: '1px solid black', borderRadius: '8px' }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="xl">
                <TextInput
                  label="案件名"
                  styles={{ label: { fontWeight: 700 } }}
                  placeholder="案件の件名を入力"
                  error={errors.title?.message}
                  required
                  {...register('title')}
                />

                <Textarea
                  label="概要"
                  styles={{ label: { fontWeight: 700 } }}
                  placeholder="案件の概要を入力"
                  error={errors.summary?.message}
                  required
                  minRows={4}
                  {...register('summary')}
                />

                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      label="必要なスキル"
                      styles={{ label: { fontWeight: 700 } }}
                      placeholder="スキルを選択"
                      data={AVAILABLE_SKILLS.map((skill) => skill.name)}
                      error={errors.skills?.message}
                      required
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Text fw={700} mb={8}>
                        応募締切日 <span style={{ color: 'red' }}>*</span>
                      </Text>
                      <DateInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="締切日を選択"
                        valueFormat="YYYY/MM/DD"
                      />
                      {errors.deadline?.message && (
                        <Text color="red" size="sm" mt={8}>
                          {errors.deadline.message}
                        </Text>
                      )}
                    </Box>
                  )}
                />

                <Controller
                  name="unitPrice"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      label="単価"
                      styles={{ label: { fontWeight: 700 } }}
                      placeholder="単価を入力"
                      error={errors.unitPrice?.message}
                      required
                      min={0}
                      step={1000}
                      hideControls
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Flex gap="md" justify="center" mt="xl">
                  <Button type="submit" color="blue" fullWidth>
                    保存
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </>
      )}
    </Container>
  )
}
