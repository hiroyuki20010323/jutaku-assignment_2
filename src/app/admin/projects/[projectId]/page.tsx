'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  Title,
  Text,
  Container,
  Flex,
  Stack,
  Table
} from '@mantine/core'
import Link from 'next/link'
import { TESTPROJECTS } from '../../../projects/_component/ProjectList'
import type { RouteLiteral } from 'nextjs-routes'
import DeleteProjectModal from '../_component/DeleteProjectModal'
import EntryListModal from '../_component/EntryListModal'
import { notFound } from 'next/navigation'

export default function AdminProjectDetail({
  params
}: { params: { projectId: string } }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)

  const projectData = TESTPROJECTS.find((p) => p.id === params.projectId)

  if (!projectData) {
    notFound()
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
            <Table.Td p="sm">{projectData.title}</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td bg="blue.1" align="center" p="sm">
              概要
            </Table.Td>
            <Table.Td p="sm">{projectData.summary}</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td bg="blue.1" align="center" p="sm">
              必要なスキル
            </Table.Td>
            <Table.Td p="sm">
              {projectData.skills.map((skill) => skill.name).join(', ')}
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td bg="blue.1" align="center" p="sm">
              募集締切
            </Table.Td>
            <Table.Td p="sm">
              {projectData.deadline.toLocaleDateString('ja-JP', {
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
            <Table.Td p="sm">
              {projectData.unitPrice.toLocaleString()}円
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Stack align="center" mt="xl" gap="md">
        <Button
          component={Link}
          href={`/admin/projects/${projectData.id}/edit` as RouteLiteral}
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
        onConfirm={() => {
          //TODO コンポーネントトップレベルでロジック部は別途定義
          console.log('削除処理を実行します')
          setIsDeleteModalOpen(false)
        }}
      />

      {/* エントリー一覧モーダル */}
      <EntryListModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        entryUsers={projectData.entryUsers}
      />
    </Container>
  )
}
