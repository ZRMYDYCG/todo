"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useUserStore } from "../stores/useUserStore"
import { TaskHeader } from "./Components/TaskHeader/TaskHeader"
import Stats from "./Components/Stats/Stats"
import { TasksArea } from "./Components/TasksArea/TasksArea"
import { TasksFooter } from "./Components/TaskFooter/TaskFooter"
import { TasksDialog } from "./Components/Dialogs/TaskDialog/TaskDialog"

export default function Dashboard() {
  const router = useRouter() // Next.js 路由，用于重定向
  const { user, validateUser } = useUserStore()

  // 验证逻辑
  useEffect(() => {
    const checkUser = async () => {
      const isAuthenticated = await validateUser()

      if (!isAuthenticated) {
        // 如果未认证，则重定向到登录页面
        router.push("/")
      }
    }

    checkUser() // 在组件挂载时调用验证函数
  }, [router])

  // 如果用户未认证且已发生重定向，则不渲染任何内容
  if (!user) {
    return null // 这将阻止重定向后继续渲染
  }

  return (
      <div className="flex items-center w-full h-[100vh] justify-center poppins">
        <div
            className="w-full h-full border-gray-400 flex flex-col gap-6 bg-inherit
      rounded-md p-8"
        >
          <TaskHeader />
          <Stats />
          <AllTasksHeader />
          <TasksArea />
          <TasksFooter />
        </div>
      </div>
  )
}

function AllTasksHeader() {
  return (
      <div className="flex justify-between items-center mt-4 mb-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{`今天的任务`}</h2>
          <p className="text-sm text-gray-400">{formatDate()}</p>
        </div>

        <TasksDialog />
      </div>
  )
}

function formatDate(date: Date = new Date()): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric", // 应为 'numeric'，不是 'string'
    month: "long", // 应为 'long'（用于完整的月份名称）
    year: "numeric" // 应为 'numeric'，不是 'string'
  }
  return date.toLocaleDateString("en-GB", options)
}
