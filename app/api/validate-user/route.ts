import { NextResponse } from "next/server"
import { validateRequest } from "@/app/aut"

export async function GET() {
  try {
    const user = await validateRequest()

    if (!user || !user.user) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 })
    }
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.user.id,
        email: user.user.email,
        // 添加您需要的其他用户属性，但要小心不要公开敏感信息
      },
    })
  } catch (error) {
    console.error("验证错误:", error)
    return NextResponse.json(
        { isAuthenticated: false, error: "验证失败" },
        { status: 500 }
    )
  }
}
