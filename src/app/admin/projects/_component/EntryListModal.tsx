import { Box, Button, Center, Modal, Text, Stack } from '@mantine/core'

type EntryListModalProps = {
  isOpen: boolean
  onClose: () => void
  entryUsers: { id: string; username: string }[]
}

export default function EntryListModal({
  isOpen,
  onClose,
  entryUsers
}: EntryListModalProps) {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      size="md"
      title={<Text fw={700}>エントリー一覧</Text>}
    >
      <Box py="md">
        <Stack>
          {entryUsers.map((user) => (
            <Center key={user.id}>
              <Text fw={400}>{user.username}</Text>
            </Center>
          ))}
        </Stack>
      </Box>
    </Modal>
  )
}
