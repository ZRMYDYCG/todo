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
import { signUpSchema } from "../validationSchema"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import { useUserStore } from "@/app/stores/useUserStore"

// 从 signUpSchema 推断表单数据类型
type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUp() {
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const { toast } = useToast()
  const router = useRouter()

  const { signUpFunction, isLoading } = useUserStore()

  const onSubmit = async (data: SignUpFormData) => {
    const res = await signUpFunction({
      email: data.email,
      password: data.password,
    })

    if (res.result) {
      toast({
        title: "注册成功！",
        description: "您的账户已创建.",
      })
      router.push("/to-dos")
    } else if (res.error) {
      toast({
        title: res.error,
        description:
            "该邮箱已被注册。请使用其他邮箱或尝试登录.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "注册失败",
        description: "发生未知错误",
        variant: "destructive",
      })
    }
  }

  const handleErrorsToast = () => {
    const { errors } = methods.formState
    const errorFields = ["email", "password", "confirmPassword"] as const

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
            <form onSubmit={methods.handleSubmit(onSubmit, handleErrorsToast)}>
              <CardHeader>
                <CardTitle className="text-[22px] font-bold">注册</CardTitle>
                <CardDescription>
                  输入您的信息以创建账户
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 mt-3">
                <EmailInput name="email" label="邮箱" />
                <PasswordInput name="password" label="密码" />
                <PasswordInput name="confirmPassword" label="确认密码" />
                <div className="mt-4 text-sm flex items-center justify-center gap-1">
                  <span>已经有账户了吗？</span>
                  <Label className="text-primary">
                    <Link href="/">登录</Link>
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  {isLoading ? "加载中..." : "创建账户"}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
      </div>
  )
}
