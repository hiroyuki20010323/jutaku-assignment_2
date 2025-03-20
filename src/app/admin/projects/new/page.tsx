'use client'

import { useForm, Controller } from 'react-hook-form'
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
import { DateInput } from '@mantine/dates'
import { useCreateProjectStore } from '@/store'
import { createProjectSchema } from '~/schema/project'
import type { CreateProjectInput } from '~/types/project'
import { AVAILABLE_SKILLS } from '../[projectId]/edit/page'

export default function CreateProject() {
  const { addProject } = useCreateProjectStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      summary: '',
      skills: [],
      deadline: new Date(),
      unitPrice: 0
    }
  })

  const onSubmit = (data: CreateProjectInput) => {
    try {
      // TODO この辺りのロジックも実際はDBに保存だからAPI実装時に消す

      const formattedSkills = data.skills.map((skillName) => {
        const availableSkill = AVAILABLE_SKILLS.find(
          (s) => s.name === skillName
        )

        return availableSkill
          ? { id: availableSkill.id, name: availableSkill.name }
          : { id: `skill-${crypto.randomUUID().slice(0, 8)}`, name: skillName }
      })

      const newProject = {
        id: crypto.randomUUID(),
        title: data.title,
        summary: data.summary,
        skills: formattedSkills,
        deadline: data.deadline,
        unitPrice: data.unitPrice,
        entryUsers: []
      }

      addProject(newProject)

      setTimeout(() => {
        const currentState = useCreateProjectStore.getState()
        console.log('保存されたプロジェクト一覧:', currentState.projects)
      }, 100)
    } catch (error) {
      console.error('プロジェクト作成エラー:', error)
    }
  }

  return (
    <Container size="md">
      <Stack mb="xl" mt={40}>
        <Title order={2} ta="center">
          新規案件作成
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
                  hideControls
                  value={field.value}
                  onChange={(val) => field.onChange(val || 0)}
                />
              )}
            />

            <Flex gap="md" justify="center" mt={40}>
              <Button type="submit" color="blue" fullWidth>
                登録
              </Button>
            </Flex>
          </Stack>
        </form>
      </Box>
    </Container>
  )
}
