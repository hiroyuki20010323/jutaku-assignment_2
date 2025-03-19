'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  Title,
  Table,
  Badge,
  Text,
  Container,
  Flex
} from '@mantine/core'
import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'

import DeleteProjectModal from './_component/DeleteProjectModal'
import { TESTPROJECTS } from '@/app/projects/_component/ProjectList'

export default function AdminProjects() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const handleConfirmDelete = () => {
    // 削除処理のロジックを書くところ
    setDeleteModalOpen(false)
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
          {TESTPROJECTS.map((project) => (
            <Table.Tr key={project.id}>
              <Table.Td>
                {project.createdAt.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  timeZone: 'Asia/Tokyo'
                })}
              </Table.Td>
              <Table.Td>{project.title}</Table.Td>
              <Table.Td>
                <Text lineClamp={1}>{project.summary}</Text>
              </Table.Td>
              <Table.Td>
                {project.skills.map((skill) => (
                  <Badge key={skill.id} mr="xs" mb="xs" variant="outline">
                    {skill.name}
                  </Badge>
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
                    onClick={() => setDeleteModalOpen(true)}
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
      />
    </Container>
  )
}
