'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  Title,
  Container,
  Flex,
  Stack,
  Table,
  Center,
  Loader
} from '@mantine/core'
import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import DeleteProjectModal from '../_component/DeleteProjectModal'
import EntryListModal from '../_component/EntryListModal'
import { notFound, useRouter } from 'next/navigation'
import { clientApi } from '~/lib/trpc/client-api'

export default function AdminProjectDetail({
  params
}: { params: { projectId: string } }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)
  const router = useRouter()

  const {
    data: project,
    isLoading,
    error
  } = clientApi.adminProject.findById.useQuery(params.projectId)

  const deleteProject = clientApi.adminProject.delete.useMutation({
    onSuccess: () => {
      // 削除成功後に一覧ページにリダイレクト
      router.push('/admin/projects')
    }
  })

  const handleConfirmDelete = (id: string) => {
    deleteProject.mutate(id)
    setIsDeleteModalOpen(false)
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
    <Container size="md">
      <Stack mb="xl" mt={40}>
        <Title order={2} ta="center">
          案件詳細
        </Title>
        <Box>
          <Flex justify="flex-end">
            <Button
              component={Link}
              href="/admin/projects"
              variant="filled"
              color="blue"
              w={100}
            >
              戻る
            </Button>
          </Flex>
        </Box>
      </Stack>

      <Table variant="vertical" layout="fixed" withTableBorder>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td bg="blue.1" align="center" w="20%" p="sm">
              案件名
            </Table.Td>
            <Table.Td p="sm">{project.title}</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td bg="blue.1" align="center" p="sm">
              概要
            </Table.Td>
            <Table.Td p="sm">{project.summary}</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td bg="blue.1" align="center" p="sm">
              必要なスキル
            </Table.Td>
            <Table.Td p="sm">
              {project.skills.map((skill) => skill.name).join(', ')}
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td bg="blue.1" align="center" p="sm">
              募集締切
            </Table.Td>
            <Table.Td p="sm">
              {new Date(project.deadline).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Tokyo'
              })}
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td bg="blue.1" align="center" p="sm">
              単価
            </Table.Td>
            <Table.Td p="sm">{project.unitPrice.toLocaleString()}円</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Stack align="center" mt="xl" gap="md">
        <Button
          component={Link}
          href={`/admin/projects/${project.id}/edit` as RouteLiteral}
          color="blue"
          w={400}
        >
          編集する
        </Button>
        <Button color="blue" w={400} onClick={() => setIsEntryModalOpen(true)}>
          この案件のエントリー一覧を見る
        </Button>
        <Button color="red" w={400} onClick={() => setIsDeleteModalOpen(true)}>
          この案件を削除する
        </Button>
      </Stack>

      {/* 削除確認モーダル */}
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        projectId={project.id}
      />

      {/* エントリー一覧モーダル */}
      <EntryListModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        entryUsers={project.entryUsers}
      />
    </Container>
  )
}
