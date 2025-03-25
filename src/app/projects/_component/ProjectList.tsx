'use client'
import React from 'react'
import { Box, Button, Title, Table, Text } from '@mantine/core'
import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { clientApi } from '~/lib/trpc/client-api'

export const ProjectList = () => {
  const { data: projects } = clientApi.project.list.useQuery()

  return (
    <>
      <Title order={2} ta="center" mb="lg" mt={80}>
        案件一覧
      </Title>
      <Box style={{ display: 'flex', justifyContent: 'flex-end' }} mb={40}>
        <Button component={Link} href="/entry-list">
          エントリー一覧
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
                <Button
                  variant="contained"
                  color="blue"
                  size="xs"
                  component={Link}
                  href={`/projects/${project.id}` as RouteLiteral}
                >
                  詳細
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
