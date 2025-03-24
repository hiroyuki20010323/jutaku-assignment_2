'use client'
import React, { useState } from 'react'
import { Box, Button, Title, Table, Text, Container, Flex } from '@mantine/core'
import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import DeleteProjectModal from './_component/DeleteProjectModal'
import { clientApi } from '~/lib/trpc/client-api'

export default function AdminProjects() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [projectIdToDelete, setProjectIdToDelete] = useState<string | null>(
    null
  )

  const { data: projects, refetch } = clientApi.project.list.useQuery()
  const deleteProject = clientApi.adminProject.delete.useMutation({
    onSuccess: () => {
      refetch() // プロジェクトリストを再取得
    }
  })

  const handleDeleteClick = (id: string) => {
    setProjectIdToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = (id: string) => {
    deleteProject.mutate(id)
    setDeleteModalOpen(false)
    setProjectIdToDelete(null)
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="lg">
        案件一覧
      </Title>
      <Box style={{ display: 'flex', justifyContent: 'flex-end' }} mb={40}>
        <Button component={Link} href="/admin/projects/new">
          新規案件作成
        </Button>
      </Box>

      <Table verticalSpacing="sm" withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th bg="blue.1" ta="center">
              案件作成日
            </Table.Th>
            <Table.Th bg="blue.1" ta="center">
              案件名
            </Table.Th>
            <Table.Th bg="blue.1" ta="center">
              概要
            </Table.Th>
            <Table.Th bg="blue.1" ta="center">
              必要なスキル
            </Table.Th>
            <Table.Th bg="blue.1" ta="center">
              詳細
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {projects?.map((project) => (
            <Table.Tr key={project.id}>
              <Table.Td ta="center">
                {new Date(project.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  timeZone: 'Asia/Tokyo'
                })}
              </Table.Td>
              <Table.Td ta="center">{project.title}</Table.Td>
              <Table.Td ta="center">
                <Text lineClamp={1}>{project.summary}</Text>
              </Table.Td>
              <Table.Td ta="center">
                {project.skills.map((skill, index) => (
                  <Text key={skill.id} component="span" mr="xs" mb="xs">
                    {skill.name}
                    {index < project.skills.length - 1 ? ', ' : ''}
                  </Text>
                ))}
              </Table.Td>
              <Table.Td ta="center">
                <Flex gap="xs" justify="center">
                  <Button
                    variant="filled"
                    color="blue"
                    size="xs"
                    component={Link}
                    href={`/admin/projects/${project.id}` as RouteLiteral}
                  >
                    詳細
                  </Button>
                  <Button
                    variant="filled"
                    color="blue"
                    size="xs"
                    component={Link}
                    href={`/admin/projects/${project.id}/edit` as RouteLiteral}
                  >
                    編集
                  </Button>
                  <Button
                    variant="filled"
                    color="red"
                    size="xs"
                    onClick={() => handleDeleteClick(project.id)}
                  >
                    削除
                  </Button>
                </Flex>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* 削除確認モーダル */}
      <DeleteProjectModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        projectId={projectIdToDelete}
      />
    </Container>
  )
}
