import { z } from "zod"

export const authSchema = z.object({
  email: z.string().email({ message: "请输入有效的电子邮件！" }),

  password: z
      .string()
      .min(6, { message: "密码必须至少为 6 个字符" }),
})

// 扩展的注册模式，包含确认密码字段
export const signUpSchema = authSchema
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "密码必须匹配",
      path: ["confirmPassword"], // 设置错误的路径
    })
