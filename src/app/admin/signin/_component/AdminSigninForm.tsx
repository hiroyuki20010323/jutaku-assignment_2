'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signin } from '@/serverActions/supabaseAuth'

// Mantine のコンポーネント
import {
  Card,
  Button,
  TextInput,
  PasswordInput,
  Title,
  Stack,
  Box
} from '@mantine/core'
import type { SignInFormData } from '~/types/auth'
import { signInSchema } from '~/schema/auth'

export const AdminSigninForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: SignInFormData) => {
    console.log('管理者ログイン処理発火')
    await signin(data)
  }

  return (
    <>
      <Title order={2} ta="center" mt={100}>
        管理者ログイン
      </Title>
      <Card
        withBorder
        radius="md"
        padding="xl"
        mt={40}
        w={600}
        h={400}
        style={{ maxWidth: 600, margin: 'auto', border: '0.5px solid black' }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack style={{ gap: '1rem' }} p={6}>
            <TextInput
              label="メールアドレス"
              styles={{ label: { fontWeight: 700 } }}
              placeholder="your@example.dev"
              required
              {...register('email')}
              // React Hook Form のエラーを Mantine 側の error プロップに渡す
              error={errors.email?.message}
              disabled={isSubmitting}
            />

            <PasswordInput
              label="パスワード"
              styles={{ label: { fontWeight: 700 } }}
              placeholder="Password"
              required
              mt={10}
              {...register('password')}
              error={errors.password?.message}
              disabled={isSubmitting}
            />

            <Button type="submit" mt={50} mb={44} loading={isSubmitting}>
              ログイン
            </Button>
          </Stack>
        </form>
      </Card>
    </>
  )
}
