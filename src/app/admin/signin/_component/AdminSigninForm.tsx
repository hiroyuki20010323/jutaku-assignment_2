'use client'
import { Box, Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { signin } from '@/serverActions/supabaseAuth'
import type { SignInFormData } from '~/types/auth'
import { signInSchema } from '~/schema/auth'

export const AdminSigninForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = async (data: SignInFormData) => {
    console.log('ログイン処理発火')
    await signin(data)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} maw={400} mx="auto">
      <TextInput
        label="メールアドレス"
        placeholder="email"
        {...register('email')}
        // React Hook Form のエラーを Mantine 側の error プロップに渡す
        error={errors.email?.message}
        disabled={isSubmitting}
      />

      <PasswordInput
        label="パスワード"
        placeholder="password"
        {...register('password')}
        error={errors.password?.message}
        disabled={isSubmitting}
      />

      <Button type="submit" fullWidth mt="xl">
        ログイン
      </Button>
    </Box>
  )
}
