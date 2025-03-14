'use client'
import { Box, Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '~/schema/auth'
import type { LoginFormValues } from '~/types/auth'

export const AdminSigninForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (data: LoginFormValues) => {
    console.log('ログイン処理発火')
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} maw={400} mx="auto">
      <TextInput
        label="メールアドレス"
        placeholder="your@gmail.com"
        required
        error={errors.email?.message}
        {...register('email')}
      />

      <PasswordInput
        label="パスワード"
        placeholder="Password"
        required
        mt="md"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" fullWidth mt="xl">
        ログイン
      </Button>
    </Box>
  )
}
