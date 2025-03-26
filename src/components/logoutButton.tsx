'use client'

import { UnstyledButton } from '@mantine/core'
import { RxExit } from 'react-icons/rx'
import { signOut } from '@/serverActions/supabaseAuth'
import { useTransition } from 'react'
import { usePathname } from 'next/navigation'

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()

  const authPaths = ['/', '/signup', '/signin', '/admin/signin']

  if (authPaths.includes(pathname)) {
    return null
  }

  const handleLogout = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <UnstyledButton onClick={handleLogout} m={20} disabled={isPending}>
      <RxExit size={24} color="red" />
    </UnstyledButton>
  )
}
