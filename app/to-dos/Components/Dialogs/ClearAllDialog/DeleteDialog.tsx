import { useTasksStore } from "@/app/stores/useTasksStore"
import { useUserStore } from "@/app/stores/useUserStore"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

export function DeleteDialog() {
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    taskSelected,
    setTaskSelected,
    deleteTaskFunction,
    isLoading,
    tasks,
  } = useTasksStore()

  const [message, setMessage] = useState("")
  const { user } = useUserStore()

  function handleOpenChange(open: boolean) {
    if (open) {
      setOpenDeleteDialog(open)
    }
  }

  useEffect(() => {
    if (taskSelected) {
      setMessage(`此操作无法撤销。将永久删除任务 
      [${taskSelected.name}] 并将其从服务器中移除！`)
    } else {
      setMessage(`此操作无法撤销。将永久删除所有任务
            并将其从服务器中移除！`)
    }
  }, [taskSelected])

  async function deleteFunction() {
    if (taskSelected) {
      const result = await deleteTaskFunction("delete", user, taskSelected)

      if (result.success) {
        // 显示任务删除成功的通知
        toast({
          title: "任务已删除",
          description: `任务已成功删除.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: "删除任务时出错.",
        })
      }
    } else {
      const result = await deleteTaskFunction("deleteAll", user)

      if (result.success) {
        // 显示所有任务删除成功的通知
        toast({
          title: "任务已删除",
          description: `所有任务已成功删除.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: "删除任务时出错.",
        })
      }
    }
    setTaskSelected(null)
    setOpenDeleteDialog(false)
  }

  return (
      <AlertDialog open={openDeleteDialog} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger disabled={tasks.length === 0}>
          <Button variant="link" disabled={tasks.length === 0}>
            清除所有
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="p-7">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              您确定吗？
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-7">
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-7">
            <AlertDialogCancel
                onClick={() => {
                  setTaskSelected(null)
                  setOpenDeleteDialog(false)
                }}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteFunction}>
              {isLoading ? "加载中..." : "删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}
