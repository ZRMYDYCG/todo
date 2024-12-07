import { NextResponse } from "next/server"
import { logout } from "@/app/logout" // 根据需要调整导入路径

export async function GET() {
  try {
    const result = await logout()
    if (result.error) {
      return NextResponse.json(
          { success: false, error: result.error },
          { status: 401 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("登出错误:", error)
    return NextResponse.json(
        { success: false, error: "登出失败" },
        { status: 500 }
    )
  }
}
