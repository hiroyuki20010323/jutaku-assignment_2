import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from '~/lib/trpc/client-api'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { Box, ColorSchemeScript, MantineProvider } from '@mantine/core'
import LogoutButton from '@/components/logoutButton'

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Template App',
  description: 'Template App Description'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <TRPCProvider>
      <html lang="ja" data-mantine-color-scheme="light">
        <head>
          <ColorSchemeScript />
        </head>
        <body className={inter.className}>
          <MantineProvider>
            <Box pos="fixed" top={10} right={20} style={{ zIndex: 1000 }}>
              <LogoutButton />
            </Box>
            <Box>{children}</Box>
          </MantineProvider>
        </body>
      </html>
    </TRPCProvider>
  )
}
