'use client'
import {
  Box,
  Title,
  Table,
  Container,
  Button,
  Text,
  Center,
  Loader
} from '@mantine/core'
import Link from 'next/link'
import { clientApi } from '~/lib/trpc/client-api'

export default function EntryList() {
  // ユーザーのエントリーリストを取得
  const {
    data: entries,
    isLoading,
    error
  } = clientApi.project.entryList.useQuery()

  // ローディング中の表示
  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Center style={{ height: '50vh' }}>
          <Loader size="xl" />
        </Center>
      </Container>
    )
  }

  // エラー時の表示
  if (error) {
    return (
      <Container size="lg" py="xl">
        <Center style={{ height: '50vh' }}>
          <Text color="red" fw={700}>
            エラー: {error.message}
          </Text>
        </Center>
      </Container>
    )
  }

  // エントリーがない場合の表示
  if (!entries || entries.length === 0) {
    return (
      <Container size="lg" py="xl" mt={80}>
        <Box mb="xl">
          <Title order={2} ta="center">
            エントリー済み一覧
          </Title>
        </Box>
        <Box ta="right" mb={40}>
          <Button component={Link} href="/projects" variant="contained" w={100}>
            戻る
          </Button>
        </Box>
        <Center style={{ height: '30vh' }}>
          <Text size="lg">エントリーした案件はありません</Text>
        </Center>
      </Container>
    )
  }

  return (
    <Container size="lg" py="xl" mt={80}>
      <Box mb="xl">
        <Title order={2} ta="center">
          エントリー済み一覧
        </Title>
      </Box>
      <Box ta="right" mb={40}>
        <Button component={Link} href="/projects" variant="contained" w={100}>
          戻る
        </Button>
      </Box>

      <Table verticalSpacing="sm" withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th bg="blue.1" ta="center">
              エントリー日
            </Table.Th>
            <Table.Th bg="blue.1" ta="center">
              案件名
            </Table.Th>
            <Table.Th bg="blue.1" ta="center">
              単価
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.map((entry) => (
            <Table.Tr key={entry.id}>
              <Table.Td ta="center">
                {new Date(entry.entryDate).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  timeZone: 'Asia/Tokyo'
                })}
              </Table.Td>
              <Table.Td ta="center">{entry.project.title}</Table.Td>
              <Table.Td ta="center">
                ¥{entry.project.unitPrice.toLocaleString()}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  )
}
