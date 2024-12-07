"use client"
import { Button } from "@/components/ui/button"
import { FormProvider, useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { TaskForm } from "./TaskForm"
import { FaPlus } from "react-icons/fa"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { useTasksStore } from "@/app/stores/useTasksStore"
import { nanoid } from "nanoid"
import { Task } from "@/app/data/Tasks"
import { toast } from "@/hooks/use-toast"
import { useUserStore } from "@/app/stores/useUserStore"

const taskFormSchema = z.object({
  taskName: z
      .string()
      .min(3, { message: "任务名称必须至少为 3 个字符" }),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "请选择优先级" }),
  }),
  status: z.enum(["in progress", "completed"], {
    errorMap: () => ({ message: "请选择状态" }),
  }),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

export function TasksDialog() {
  const methods = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
  })

  const {
    addNewTask,
    updateTaskFunction,
    isLoading,
    isTaskDialogOpened,
    setIsTaskDialogOpened,
    tasks,
    taskSelected,
    setTaskSelected,
  } = useTasksStore()

  const { user } = useUserStore()

  async function onSubmit(data: TaskFormValues) {
    // 查看任务名称是否已在任务数组中存在
    const findTask = tasks.find(
        (task) => task.name.toLowerCase() === data.taskName.toLowerCase()
    )

    // 如果任务名称已存在且我们不打算编辑任务（!taskSelected），则设置表单错误并退出函数
    if (findTask && !taskSelected) {
      // 为 'taskName' 字段设置表单错误
      methods.setError("taskName", {
        type: "manual",
        message: `名为 "${data.taskName}" 的任务已存在.`,
      })

      // 可选择性地显示 toast 以改善用户体验
      toast({
        variant: "destructive", // 定制错误样式
        title: "任务已存在",
        description: `名为 "${data.taskName}" 的任务已存在.`,
      })

      methods.setFocus("taskName")

      return // 退出函数以防止添加任务
    }

    // 如果 taskSelected 不是 null，表示我们要更新任务，
    // 否则我们将添加新任务

    if (!taskSelected) {
      const newTask: Task = {
        id: nanoid(),
        name: data.taskName,
        priority: data.priority,
        status: data.status,
        userId: user?.id || "",
      }

      const result = await addNewTask(newTask)

      if (result.success) {
        // 显示任务添加成功的通知
        toast({
          title: "任务已添加",
          description: `任务 "${newTask.name}" 已成功添加.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: "添加任务时出错.",
        })
      }
    } else {
      const updatedTask: Task = {
        ...taskSelected,
        name: data.taskName,
        status: data.status,
        priority: data.priority,
      }

      const result = await updateTaskFunction(updatedTask)

      if (result.success) {
        // 显示任务更新成功的通知
        toast({
          title: "任务已更新",
          description: `任务已成功更新.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: "更新任务时出错.",
        })
      }
    }
    setTaskSelected(null)
    setIsTaskDialogOpened(false)

    // 提交后关闭模态框或对话框
  }

  // 处理对话框状态变化（打开/关闭）
  function handleDialogStateChange(isOpen: boolean) {
    setIsTaskDialogOpened(isOpen)
    if (!isOpen) {
      methods.reset() // 关闭对话框时重置表单字段
      setTaskSelected(null)
    }
  }

  // 如果任务对话框打开且 taskSelected 不是 null
  // 更新表单的值

  useEffect(() => {
    if (isTaskDialogOpened) {
      if (taskSelected) {
        // 设置任务名称
        methods.setValue("taskName", taskSelected.name)
        // 设置优先级并手动触发以跟踪
        methods.setValue("priority", taskSelected.priority)
        methods.trigger("priority")
        // 设置状态并手动触发以跟踪
        methods.setValue("status", taskSelected.status)
        methods.trigger("status")
      } else {
        methods.reset()
      }
    }
  }, [isTaskDialogOpened])

  return (
      <Dialog open={isTaskDialogOpened} onOpenChange={handleDialogStateChange}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-1">
            <FaPlus />
            <span>新任务</span>
          </Button>
        </DialogTrigger>
        {/* 表单提供者 */}
        <FormProvider {...methods}>
          <DialogContent className="p-7 poppins">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {taskSelected ? "编辑任务" : "添加任务"}
              </DialogTitle>
              <DialogDescription>
                {`在这里添加新任务。完成后点击保存.`}
              </DialogDescription>
            </DialogHeader>

            {/* 表单开始 */}
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <TaskForm />
              <DialogFooter className="mt-11">
                <Button type="submit" className="flex items-center gap-1">
                  {isLoading ? (
                      <div>加载中...</div>
                  ) : (
                      <div className="flex items-center gap-1">
                        <span>保存任务</span>
                      </div>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </FormProvider>
      </Dialog>
  )
}
