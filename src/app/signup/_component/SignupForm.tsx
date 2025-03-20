'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signup } from '@/serverActions/supabaseAuth'

// Mantine のコンポーネント
import {
  Card,
  Button,
  TextInput,
  PasswordInput,
  Title,
  Stack,
  Text
} from '@mantine/core'
import { signupSchema } from '~/schema/auth'
import type { SignupFormData } from '~/types/auth'

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSignupSubmit = async (data: SignupFormData) => {
    signup(data)
    console.log(data)
  }

  return (
    <>
      <Title
        order={2}
        mt={100}
        style={{ textAlign: 'center', marginBottom: '1rem' }}
      >
        新規登録
      </Title>

      <Card
        withBorder
        radius="md"
        padding="xl"
        mt={40}
        w={600}
        h={580}
        style={{ maxWidth: 600, margin: 'auto', border: '0.5px solid black' }}
      >
        <form onSubmit={handleSubmit(onSignupSubmit)}>
          {/* MantineのStackで要素を縦に並べ、styleで間隔を指定する */}
          <Stack style={{ gap: '1rem' }} p={6}>
            <TextInput
              label="お名前"
              styles={{ label: { fontWeight: 700 } }}
              placeholder="山田 太郎"
              required
              mt={10}
              {...register('name')}
              error={errors.name?.message}
              disabled={isSubmitting}
            />

            <TextInput
              label="メールアドレス"
              styles={{ label: { fontWeight: 700 } }}
              placeholder="your@example.dev"
              required
              {...register('email')}
              // React Hook Form のエラーを Mantine 側のerrorプロップに渡す
              error={errors.email?.message}
              disabled={isSubmitting}
            />

            <PasswordInput
              label="パスワード"
              styles={{ label: { fontWeight: 700 } }}
              placeholder="Password"
              mt={10}
              required
              {...register('password')}
              error={errors.password?.message}
              disabled={isSubmitting}
            />

            <PasswordInput
              label="パスワード（確認）"
              styles={{ label: { fontWeight: 700 } }}
              placeholder="Password"
              required
              mt={10}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              disabled={isSubmitting}
            />
            <Button type="submit" mt={50} mb={30} loading={isSubmitting}>
              登録
            </Button>
          </Stack>
        </form>

        {/* エラーメッセージがあれば全体で拾う例（必要があれば使用） */}
        {/* {errors.email?.message && (
        <Text color="red" size="sm" mt="sm">
          {errors.email.message}
        </Text>
      )}
      {errors.password?.message && (
        <Text color="red" size="sm">
          {errors.password.message}
        </Text>
      )} */}
      </Card>
    </>
  )
}
