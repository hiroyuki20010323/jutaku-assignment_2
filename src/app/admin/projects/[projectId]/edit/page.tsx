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
  Text,
  Center,
  Loader
} from '@mantine/core'
import Link from 'next/link'
import { Controller } from 'react-hook-form'
import { DateInput } from '@mantine/dates'
import { useEffect } from 'react'
import type { EditProjectInput } from '~/types/project'
import { editProjectSchema } from '~/schema/project'
import { clientApi } from '~/lib/trpc/client-api'
import { useRouter } from 'next/navigation'

export default function EditProject({
  params
}: { params: { projectId: string } }) {
  const { data: project, refetch } = clientApi.adminProject.findById.useQuery(
    params.projectId
  )

  const editMutation = clientApi.adminProject.edit.useMutation()

  const { data: availableSkills = [] } =
    clientApi.adminProject.findAllSkills.useQuery()

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset
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
    if (project) {
      reset({
        title: project.title,
        summary: project.summary,
        skills: project.skills.map((skill: { name: string }) => skill.name),
        deadline: new Date(project.deadline),
        unitPrice: project.unitPrice
      })
    }
  }, [project, reset])

  const onSubmit = async (data: EditProjectInput) => {
    try {
      const formattedData = {
        ...data,
        deadline:
          data.deadline instanceof Date
            ? data.deadline
            : new Date(data.deadline)
      }

      const apiData = {
        ...formattedData,
        deadline: formattedData.deadline.toISOString()
      }

      const result = await editMutation.mutateAsync({
        projectId: params.projectId,
        projectData: apiData
      })

      if (result) {
        await refetch()
        alert('プロジェクトを更新しました')
        router.push('/admin/projects')
      }
    } catch (error) {
      console.error('プロジェクト更新エラー:', error)
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
                  placeholder={
                    field.value.length === 0 ? 'スキルを選択' : undefined
                  }
                  data={availableSkills.map((skill) => skill.name)}
                  error={errors.skills?.message}
                  required
                  value={field.value}
                  onChange={field.onChange}
                  hidePickedOptions
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
                  onChange={field.onChange}
                />
              )}
            />

            <Flex gap="md" justify="center" mt="xl">
              <Button
                type="submit"
                color="blue"
                fullWidth
                loading={isSubmitting}
              >
                保存
              </Button>
            </Flex>
          </Stack>
        </form>
      </Box>
    </Container>
  )
}
