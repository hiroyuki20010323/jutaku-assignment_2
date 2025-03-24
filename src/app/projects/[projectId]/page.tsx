'use client'
import {
  Box,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Container,
  Flex,
  Modal,
  Center,
  Loader
} from '@mantine/core'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { clientApi } from '~/lib/trpc/client-api'

type ProjectDataProps = {
  params: {
    projectId: string
  }
}

export default function ProjectDetail({ params }: ProjectDataProps) {
  const [modalOpened, setModalOpened] = useState(false)
  const [entryStatus, setEntryStatus] = useState<{
    loading: boolean
    success?: boolean
    error?: string
  }>({ loading: false })

  const { data: userInfo } = clientApi.userInfo.useQuery()

  const {
    data: project,
    isLoading,
    error
  } = clientApi.project.findById.useQuery(params.projectId)

  // エントリーミューテーション
  const entryMutation = clientApi.project.entry.useMutation({
    onSuccess: (data) => {
      setEntryStatus({ loading: false, success: true })
      setModalOpened(true)
    },
    onError: (error) => {
      console.error('エントリーエラー:', error)
      setEntryStatus({ loading: false, error: error.message })
      alert(`エントリーに失敗しました: ${error.message}`)
    }
  })

  const handleEntry = () => {
    if (!userInfo) {
      alert('ログインが必要です')
      return
    }

    setEntryStatus({ loading: true })

    entryMutation.mutate({
      projectId: params.projectId
    })
  }

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Center style={{ height: '50vh' }}>
          <Loader size="xl" />
        </Center>
      </Container>
    )
  }

  if (error || !project) {
    console.error('プロジェクト読み込みエラー:', error)
    return notFound()
  }

  return (
    <Container size="lg" py="xl">
      {/* エントリリー成功モーダル */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        centered
        size="md"
        withCloseButton
      >
        <Box py="md">
          <Center>
            <Text fw={700} mb="xl">
              エントリーしました！
            </Text>
          </Center>
          <Center>
            <Button color="blue" w={300} onClick={() => setModalOpened(false)}>
              OK
            </Button>
          </Center>
        </Box>
      </Modal>
      {/* モーダル */}

      <Title order={2} ta="center" mb="md" mt={16}>
        案件詳細
      </Title>

      <Box mb="xl">
        <Flex justify="flex-end">
          <Button component={Link} href="/projects" variant="contained" w={100}>
            戻る
          </Button>
        </Flex>
      </Box>

      <Paper p="xl" radius="md" withBorder mx="auto" maw={800}>
        <Box my="md">
          <Text fw={700} mb="xs">
            案件作成日
          </Text>
          <Box ml={40} mb="xl">
            <Text suppressHydrationWarning>
              {new Date(project.createdAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Tokyo'
              })}
            </Text>
          </Box>

          <Text fw={700} mb="xs">
            案件名
          </Text>
          <Box ml={40} mb="xl">
            <Text>{project.title}</Text>
          </Box>

          <Text fw={700} mb="xs">
            案件詳細
          </Text>
          <Box ml={40} mb="xl">
            <Text>{project.summary}</Text>
          </Box>

          <Text fw={700} mb="xs">
            必要なスキル
          </Text>
          <Box ml={40} mb="xl">
            <Group>
              {project.skills?.map((skill, index) => (
                <Text key={skill.id} component="span" mr="xs" mb="xs">
                  {skill.name}
                  {index < project.skills.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </Group>
          </Box>

          <Text fw={700} mb="xs">
            募集締切
          </Text>
          <Box ml={40} mb="xl">
            <Text suppressHydrationWarning>
              {new Date(project.deadline).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Tokyo'
              })}
            </Text>
          </Box>

          <Text fw={700} mb="xs">
            単価
          </Text>
          <Box ml={40} mb="xl">
            <Text>¥{project.unitPrice.toLocaleString()}</Text>
          </Box>
        </Box>

        <Button
          fullWidth
          color="blue"
          mt={80}
          size="md"
          loading={entryStatus.loading}
          onClick={handleEntry}
        >
          この案件にエントリーする
        </Button>
      </Paper>
    </Container>
  )
}
