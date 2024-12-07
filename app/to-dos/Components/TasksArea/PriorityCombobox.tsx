"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Task } from "@/app/data/Tasks"
import { useTasksStore } from "@/app/stores/useTasksStore"
import { toast } from "@/hooks/use-toast"

const priorities = [
  {
    value: "low",
    label: "低优先级",
  },
  {
    value: "medium",
    label: "中优先级",
  },
  {
    value: "high",
    label: "高优先级",
  },
]

export function ComboboxDemo({ singleTask }: { singleTask: Task }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { updateTaskFunction, isLoading } = useTasksStore()

  React.useEffect(() => {
    // 从任务数据设置初始优先级值
    setValue(singleTask.priority)
  }, [singleTask])

  // 类型保护函数
  function isValidPriority(value: string): value is "low" | "medium" | "high" {
    return value === "low" || value === "medium" || value === "high"
  }

  async function onSelectFunction(currentValue: string) {
    if (!isValidPriority(currentValue)) {
      return
    }
    // 通过创建一个新的任务对象来更新任务
    const updatedTask: Task = { ...singleTask, priority: currentValue }

    // 更新本地状态和状态管理
    setValue(currentValue)

    const result = await updateTaskFunction(updatedTask) // 调用状态管理函数来更新任务

    if (result.success) {
      // 显示成功更新任务的通知
      toast({
        title: "任务已更新",
        description: `优先级已成功更新`,
      })
    } else {
      toast({
        variant: "destructive",
        title: "错误",
        description: "更新任务时出错",
      })
    }
    setOpen(false)
  }

  return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[100px] justify-between"
          >
            {value
                ? priorities.find((framework) => framework.value === value)?.label
                : priorities[0].value}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[130px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                {priorities.map((framework) => (
                    <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={onSelectFunction}
                        disabled={isLoading}
                    >
                      {value === framework.value && isLoading
                          ? "加载中..." // 在优先级更新时显示 "加载中..."
                          : framework.label}

                      {!isLoading && (
                          <CheckIcon
                              className={cn(
                                  "ml-auto h-4 w-4",
                                  value === framework.value ? "opacity-100" : "opacity-0"
                              )}
                          />
                      )}
                    </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  )
}
