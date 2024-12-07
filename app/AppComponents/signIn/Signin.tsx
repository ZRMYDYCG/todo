"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AppLogo } from "../AppLogo"
import EmailInput from "../EmailInput"
import PasswordInput from "../PasswordInput"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authSchema } from "../validationSchema"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import { useUserStore } from "@/app/stores/useUserStore"

// 从验证模式推断类型
type AuthFormData = z.infer<typeof authSchema>

export default function SignIn() {
  const methods = useForm<AuthFormData>({ resolver: zodResolver(authSchema) })
  const { toast } = useToast()
  const router = useRouter()
  const { loginFunction, isLoading } = useUserStore()

  const onSubmit = async (data: AuthFormData) => {
    const IsLogged = await loginFunction(data)

    console.log(IsLogged)

    if (IsLogged.isLoggedIn) {
      toast({
        title: "登录成功！",
        description: "您已成功登录.",
      })
      router.push("/to-dos")
    } else {
      toast({
        title: "登录失败",
        description: IsLogged.error,
        variant: "destructive",
      })
    }

    console.log(IsLogged)
  }

  const handleErrorToast = () => {
    const { errors } = methods.formState
    const errorFields = ["email", "password"] as const

    errorFields.forEach((field) => {
      if (errors[field]) {
        toast({
          title: "验证错误",
          description: errors[field]?.message?.toString(),
          variant: "destructive",
        })
      }
    })
  }

  return (
      <div>
        <AppLogo />
        <Card className="w-full max-w-sm py-2">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit, handleErrorToast)}>
              <CardHeader>
                <CardTitle className="text-[22px] font-bold">登录</CardTitle>
                <CardDescription>
                  输入您的电子邮件以登录您的账户.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 mt-3">
                <EmailInput name="email" label="电子邮件" />
                <PasswordInput name="password" label="密码" />
                <div className="mt-4 text-sm flex items-center justify-center gap-1">
                  <span>没有账户？</span>
                  <Label className="text-primary">
                    <Link href="/sign-up">注册</Link>
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  {isLoading ? "加载中..." : "登录"}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
      </div>
  )
}
