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
import { useEffect } from 'react'
import { useEditProjectStore } from '@/store'
import type { EditProjectInput } from '~/types/projectEdit'
import { editProjectSchema } from '~/schema/projectEdit'
import { TESTPROJECTS } from '@/app/projects/_component/ProjectList'

// 仮のスキルリスト
export const AVAILABLE_SKILLS = [
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'prisma', label: 'Prisma' }
]

export default function EditProject({
  params
}: { params: { projectId: string } }) {
  const { setProject } = useEditProjectStore()

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

  // コンポーネント内で直接データを取得
  const project = TESTPROJECTS.find((p) => p.id === params.projectId)

  useEffect(() => {
    if (project) {
      setProject({
        ...project,
        skills: project.skills.map((skill) => skill.name)
      })
      reset({
        ...project,
        skills: project.skills.map((skill) => skill.name)
      })
    } else {
      console.error('プロジェクトが見つかりません')
    }
  }, [])

  const onSubmit = async (data: EditProjectInput) => {
    try {
      console.log('送信データ:', data)
    } catch (error) {
      console.error('エラー:', error)
    }
  }

  return (
    <Container size="md">
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

      <Box p="xl" style={{ border: '1px solid black', borderRadius: '8px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="lg">
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
                  data={AVAILABLE_SKILLS}
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
                  <Text fw={700} mb={5}>
                    応募締切日 <span style={{ color: 'red' }}>*</span>
                  </Text>
                  <DateInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="締切日を選択"
                    valueFormat="YYYY/MM/DD"
                  />
                  {errors.deadline?.message && (
                    <Text color="red" size="sm" mt={5}>
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
    </Container>
  )
}
