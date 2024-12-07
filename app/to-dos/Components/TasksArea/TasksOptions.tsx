"use client"
import { Task } from "@/app/data/Tasks"
import { useTasksStore } from "@/app/stores/useTasksStore"
import { useUserStore } from "@/app/stores/useUserStore"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import { SlOptions } from "react-icons/sl"

export function TasksOptions({ singleTask }: { singleTask: Task }) {
  const {
    setIsTaskDialogOpened,
    setTaskSelected,
    taskSelected,
    addNewTask,
    setOpenDeleteDialog,
  } = useTasksStore()

  const { user } = useUserStore()

  const [actionClicked, setActionClicked] = useState("")

  const handleItemClick = (action: string) => {
    // 处理点击动作
    if (action === "edit") {
      setTaskSelected(singleTask)
      setIsTaskDialogOpened(true)
    } else if (action === "copy") {
      setTaskSelected(singleTask)
      setActionClicked(action)
    } else if (action === "delete") {
      setTaskSelected(singleTask)
      setOpenDeleteDialog(true)
    }
  }

  useEffect(() => {
    if (taskSelected && actionClicked === "copy") {
      toast({
        title: "正在复制任务...",
        description: "我们正在创建任务的新副本",
      })
      createCopyOfTask()
    }
  }, [taskSelected, actionClicked])

  async function createCopyOfTask() {
    if (taskSelected) {
      const newTask: Task = {
        id: nanoid(),
        name: `${taskSelected.name} (副本)`,
        status: taskSelected.status,
        priority: taskSelected.priority,
        userId: user?.id || "",
      }

      const result = await addNewTask(newTask)

      if (result.success) {
        // 显示成功复制任务的通知
        toast({
          title: "任务已复制",
          description: `任务已成功复制.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: "复制任务时出错.",
        })
      }

      setTaskSelected(null)
      setActionClicked("")
    }
  }

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <SlOptions />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleItemClick("edit")}>
              编辑
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleItemClick("copy")}>
              复制
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="text-red-500"
                onClick={() => handleItemClick("delete")}
            >
              删除
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
