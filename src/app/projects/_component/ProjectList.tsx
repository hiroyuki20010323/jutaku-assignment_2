'use client'
import React from 'react'
import { Box, Button, Title, Table, Badge, Text } from '@mantine/core'
import Link from 'next/link'
import { RouteLiteral } from 'nextjs-routes'
export const PROJECTS = [
  {
    id:"sodfjpadovpo",
    title: 'ECサイトリニューアルプロジェクト',
    summary: 'ECサイトのデザインリニューアルと機能改善を行うプロジェクトです',
    deadline: new Date('2025-12-31T23:59:59Z'),
    unitPrice: 800000,
    skills: ['React', 'Next.js', 'AWS'],
    createdAt: new Date('2023-06-15T09:30:00+09:00')
  },
  {
    id: "abcdef123456",
    title: 'モバイルアプリ開発プロジェクト',
    summary: 'クロスプラットフォーム対応のモバイルアプリ開発',
    deadline: new Date('2025-10-15T23:59:59Z'),
    unitPrice: 1200000,
    skills: ['React Native', 'Firebase', 'TypeScript'],
    createdAt: new Date('2023-08-22T14:45:00+09:00')
  }
]

export const ProjectList = () => {
  return (
    <>
      <Title order={2} ta="center" mb="lg">
        案件一覧
      </Title>
      <Box mb="lg">
        <Button ml="auto" mr="0" display={'block'}>
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
          {PROJECTS.map((project) => (
            <Table.Tr key={project.id}>
              <Table.Td>
                {project.createdAt.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
              </Table.Td>
              <Table.Td>{project.title}</Table.Td>
              <Table.Td>
                <Text lineClamp={1}>
                  {project.summary}
                </Text>
              </Table.Td>
              <Table.Td>
                {project.skills.map((skill) => (
                  <Badge key={skill} mr="xs" mb="xs" variant="outline">
                    {skill}
                  </Badge>
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
