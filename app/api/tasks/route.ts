import { Task } from "@/app/data/Tasks"
import { NextResponse } from "next/server"
import { db } from "@/app/db/drizzle"
import { tasksTable } from "@/app/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
    request: Request
): Promise<
    NextResponse<{ tasks?: Task[]; success: boolean; message: string }>
> {
  try {
    // 从 URL 中获取用户ID
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // 如果 userId 未定义，则返回 success 为 false
    if (!userId) {
      return NextResponse.json({ success: false, message: "需要用户 ID" })
    }

    // 获取与 userId 相关的任务
    const tasks = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.userId, userId))

    // 返回成功响应
    return NextResponse.json({
      tasks,
      success: true,
      message: "成功获取任务",
    })
  } catch (error) {
    console.error("获取任务时出错:", error)
    return NextResponse.json({
      success: false,
      message: "从服务器获取任务失败.",
    })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "用户未定义",
      })
    }

    const body: { option: "delete" | "deleteAll"; task?: Task } =
        await request.json()

    const { option, task } = body

    if (!option) {
      return NextResponse.json({
        success: false,
        message: "未定义选项",
      })
    }

    if (option === "delete") {
      if (task) {
        // 删除特定的任务
        const deletedTask = await db
            .delete(tasksTable)
            .where(eq(tasksTable.id, task.id))

        if (!deletedTask) {
          return NextResponse.json({
            success: false,
            message: "任务未找到或删除失败",
          })
        }

        return NextResponse.json({
          success: true,
          message: "任务已成功删除！",
        })
      }
    }

    if (option === "deleteAll") {
      const deletedAllTasks = await db
          .delete(tasksTable)
          .where(eq(tasksTable.userId, userId)) // 删除指定用户的所有任务

      if (!deletedAllTasks) {
        return NextResponse.json({
          success: false,
          message: "删除所有任务失败",
        })
      }

      return NextResponse.json({
        success: true,
        message: "已删除所有任务",
      })
    }

    return NextResponse.json({
      success: false,
      message: "提供了无效的选项",
    })
  } catch (error) {
    console.log(error)
  }
}

export async function PUT(request: Request) {
  try {
    const body: Task = await request.json()

    // 解构并检查所有字段是否来自客户端
    const { id, name, priority, status } = body

    // 更新数据库中的任务
    const updatedTask = await db
        .update(tasksTable)
        .set({ name, priority, status })
        .where(eq(tasksTable.id, id))
        .returning()

    if (!updatedTask) {
      return NextResponse.json({
        success: false,
        message: "任务未找到或更新失败",
      })
    }

    return NextResponse.json({
      success: true,
      message: "任务已成功更新",
    })
  } catch (error) {
    console.log(error)
  }
}

export async function POST(
    request: Request
): Promise<NextResponse<{ success: boolean; message: string }>> {
  try {
    const body: Task = await request.json()

    // 解构并检查所有字段是否来自客户端
    const { id, name, priority, status, userId } = body

    if (!id || !name || !priority || !status || !userId) {
      return NextResponse.json({
        success: false,
        message: "所有字段都是必需的",
      })
    }

    // 日志记录接收到的任务数据
    console.log("收到的任务数据:", body)

    // 将任务插入数据库
    const result = await db.insert(tasksTable).values({
      id, // 使用任务的 id
      name,
      priority, // "low", "medium", 或 "high"
      status, // "in progress" 或 "completed"
      userId, // 外键引用用户
    })

    // 检查插入是否成功并返回适当的响应
    if (result) {
      return NextResponse.json({
        success: true,
        message: "任务已成功添加！",
        // 返回插入的任务以供验证
      })
    }

    // 处理可能的插入失败
    return NextResponse.json({
      success: false,
      message: "任务插入失败！",
    })
  } catch (error) {
    console.error("插入任务时出错:", error)
    return NextResponse.json({
      success: false,
      message: "在服务器中创建任务失败",
    })
  }
}
