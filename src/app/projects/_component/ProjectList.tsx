'use client'
import React from 'react'
import { Box, Button, Title, Table, Badge, Text } from '@mantine/core'
import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { TestProject } from '~/types/project'

// テストデータ
export const TESTPROJECTS: TestProject[] = [
  {
    id: 'sodfjpadovpo',
    title: 'ECサイトリニューアルプロジェクト',
    summary: 'ECサイトのデザインリニューアルと機能改善を行うプロジェクトです',
    deadline: new Date('2025-12-31T23:59:59Z'),
    unitPrice: 800000,
    skills: [
      { id: 'skill1', name: 'React' },
      { id: 'skill2', name: 'Next.js' },
      { id: 'skill3', name: 'AWS' }
    ],
    createdAt: new Date('2023-06-15T00:30:00Z'),
    entryUsers: [
      { id: 'user1', username: '吉田 一郎' },
      { id: 'user2', username: '田中 次郎' },
      { id: 'user3', username: '加藤 三朗' },
      { id: 'user4', username: '東京 四郎' }
    ]
  },
  {
    id: 'abcdef123456',
    title: 'モバイルアプリ開発プロジェクト',
    summary: 'クロスプラットフォーム対応のモバイルアプリ開発',
    deadline: new Date('2025-10-15T23:59:59Z'),
    unitPrice: 1200000,
    skills: [
      { id: 'skill4', name: 'React Native' },
      { id: 'skill5', name: 'Firebase' },
      { id: 'skill6', name: 'TypeScript' }
    ],
    createdAt: new Date('2023-08-22T05:45:00Z'),
    entryUsers: [
      { id: 'user5', username: '山田 太郎' },
      { id: 'user6', username: '田中 四蔵' },
      { id: 'user7', username: '小島 ー朗' },
      { id: 'user8', username: '新潟 四郎' }
    ]
  }
]

export const ProjectList = () => {
  return (
    <>
      <Title order={2} ta="center" mb="lg">
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
