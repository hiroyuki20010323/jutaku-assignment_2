import { Box, Button, Center, Modal, Text, Flex } from '@mantine/core'

type DeleteProjectModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteProjectModal({
  isOpen,
  onClose,
  onConfirm
}: DeleteProjectModalProps) {
  return (
    <Modal opened={isOpen} onClose={onClose} centered size="md" withCloseButton>
      <Box py="md">
        <Center>
          <Text fw={700} mb="xl">
            この案件を削除しますよろしいいですか？
          </Text>
        </Center>
        <Box mt="xl">
          <Flex justify="flex-end">
            <Button
              color="gray"
              w={100}
              variant="outline"
              mr="md"
              onClick={onClose}
            >
              いいえ
            </Button>
            <Button color="red" w={80} onClick={onConfirm}>
              はい
            </Button>
          </Flex>
        </Box>
      </Box>
    </Modal>
  )
}
