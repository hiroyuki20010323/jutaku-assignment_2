'use client'
import React from 'react'
import {
  Box,
  Button,
  Title,
  Text,
  Container,
  Flex,
  Stack,
  Grid,
} from '@mantine/core'
import Link from 'next/link'
import { PROJECTS } from '../../../projects/_component/ProjectList'
import { RouteLiteral } from 'nextjs-routes'

// 編集ページと同様にparamsを受け取る
export default function AdminProjectDetail({
  params
}: { params: { projectId: string } }) {
  // PROJECTS配列から該当するプロジェクトを直接検索
  const projectData = PROJECTS.find(p => p.id === params.projectId)

  // データが見つからない場合
  if (!projectData) {
    return (
      <Container>
        <Text>プロジェクトが見つかりません</Text>
      </Container>
    )
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
            >
              戻る
            </Button>
          </Flex>
        </Box>
      </Stack>

      <Box p="xl" style={{ border: '1px solid black', borderRadius: '8px' }}>
        <Grid>
          <Grid.Col span={3}>
            <Text fw={700} c="gray.6">案件名</Text>
          </Grid.Col>
          <Grid.Col span={9}>
            <Text>{projectData.title}</Text>
          </Grid.Col>

          <Grid.Col span={3}>
            <Text fw={700} c="gray.6">概要</Text>
          </Grid.Col>
          <Grid.Col span={9}>
            <Text>{projectData.summary}</Text>
          </Grid.Col>

          <Grid.Col span={3}>
            <Text fw={700} c="gray.6">必要なスキル</Text>
          </Grid.Col>
          <Grid.Col span={9}>
            <Text>{projectData.skills.join(', ')}</Text>
          </Grid.Col>

          <Grid.Col span={3}>
            <Text fw={700} c="gray.6">募集締切</Text>
          </Grid.Col>
          <Grid.Col span={9}>
            <Text>{projectData.deadline.toLocaleDateString('ja-JP')}</Text>
          </Grid.Col>

          <Grid.Col span={3}>
            <Text fw={700} c="gray.6">単価</Text>
          </Grid.Col>
          <Grid.Col span={9}>
            <Text>{projectData.unitPrice.toLocaleString()}円</Text>
          </Grid.Col>
        </Grid>

        <Flex gap="md" justify="center" mt="xl">
          <Button
            component={Link}
            href={`/admin/projects/${projectData.id}/edit` as RouteLiteral}
            color="blue"
            w={200}
          >
            編集する
          </Button>
          <Button
            component={Link}
            href={`/admin/projects/${projectData.id}/entries`as RouteLiteral}
            color="blue"
            w={200}
          >
            この案件のエントリー一覧を見る
          </Button>
          <Button
            color="red"
            w={200}
            onClick={() => {
              // 削除処理を実装
              console.log('削除ボタンがクリックされました')
            }}
          >
            この案件を削除する
          </Button>
        </Flex>
      </Box>
    </Container>
  )
}
