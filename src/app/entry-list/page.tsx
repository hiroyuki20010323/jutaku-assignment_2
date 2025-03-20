'use client'
import { Box, Title, Table, Container, Button } from '@mantine/core'
import Link from 'next/link'
import { TESTPROJECTS } from '../projects/_component/ProjectList'

// エントリーした日を追加したテストデータ
const ENTRIES_DATA = [
  {
    ...TESTPROJECTS[0],
    entryDate: new Date('2024-03-15T00:00:00Z')
  },
  {
    ...TESTPROJECTS[1],
    entryDate: new Date('2024-02-28T00:00:00Z')
  }
]

export default function EntryList() {
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
          {ENTRIES_DATA.map((entry) => (
            <Table.Tr key={entry.id}>
              <Table.Td ta="center">
                {entry.entryDate.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  timeZone: 'Asia/Tokyo'
                })}
              </Table.Td>
              <Table.Td ta="center">{entry.title}</Table.Td>
              <Table.Td ta="center">
                ¥{entry.unitPrice.toLocaleString()}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  )
}
