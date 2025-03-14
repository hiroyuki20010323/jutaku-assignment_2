'use client'
import {
  Box,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Button,
  Container,
  Flex,
  Modal,
  Center,
  Stack
} from '@mantine/core'
import { PROJECTS } from '../_component/ProjectList'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

type ProjectDataProps = {
  params: {
    projectId: string
  }
}

export default function ProjectDetail({ params }: ProjectDataProps) {
  const [modalOpened, setModalOpened] = useState(false)
  const project = PROJECTS.find((p) => p.id === params.projectId)

  if (!project) {
    notFound()
  }

  return (
    <Container size="lg" py="xl">
      {/* モーダル */}
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

      <Title order={2} ta="center" mb="md">
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
          <Box ml={40} mb="lg">
            <Text suppressHydrationWarning>
              {project.createdAt.toLocaleDateString('ja-JP', {
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
          <Box ml={40} mb="lg">
            <Text>{project.title}</Text>
          </Box>

          <Text fw={700} mb="xs">
            案件詳細
          </Text>
          <Box ml={40} mb="lg">
            <Text>{project.summary}</Text>
          </Box>

          <Text fw={700} mb="xs">
            必要なスキル
          </Text>
          <Box ml={40} mb="lg">
            <Group>
              {project.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </Group>
          </Box>

          <Text fw={700} mb="xs">
            募集締切
          </Text>
          <Box ml={40} mb="lg">
            <Text suppressHydrationWarning>
              {project.deadline.toLocaleDateString('ja-JP', {
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
          <Box ml={40} mb="lg">
            <Text>¥{project.unitPrice.toLocaleString()}</Text>
          </Box>
        </Box>

        <Button
          fullWidth
          color="blue"
          mt="xl"
          size="md"
          onClick={() => setModalOpened(true)}
        >
          この案件にエントリーする
        </Button>
      </Paper>
    </Container>
  )
}
