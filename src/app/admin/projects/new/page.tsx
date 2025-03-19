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
import { z } from 'zod'
import { useCreateProjectStore } from '@/store'

const createProjectSchema = z.object({
  title: z.string().min(1, '案件名は必須です'),
  summary: z.string().min(1, '概要は必須です'),
  skills: z.array(z.string()).min(1, '少なくとも1つのスキルを選択してください'),
  deadline: z.date({
    required_error: '締切日は必須です',
    invalid_type_error: '有効な日付を入力してください'
  }),
  unitPrice: z.number().min(1, '単価は必須です')
})

type CreateProjectInput = z.infer<typeof createProjectSchema>

// 仮のスキルリスト
const AVAILABLE_SKILLS = [
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'prisma', label: 'Prisma' }
]

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
    // addProject({
    //   id: crypto.randomUUID(),
    //   ...data,
    //   createdAt: new Date()
    // })
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
                登録
              </Button>
            </Flex>
          </Stack>
        </form>
      </Box>
    </Container>
  )
}
