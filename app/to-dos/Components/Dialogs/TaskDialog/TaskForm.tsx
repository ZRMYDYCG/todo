"use client"
import { useTasksStore } from "@/app/stores/useTasksStore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react"
import { FieldErrors, FieldValues, useFormContext } from "react-hook-form"
import { BiSolidError } from "react-icons/bi"
import { FaCircle } from "react-icons/fa6"

export function TaskForm() {
  return (
      <div className="flex flex-col gap-6 mt-8">
        <TaskName />
        <div className="grid grid-cols-2 gap-6">
          <TaskPriority />
          <TaskStatus />
        </div>
      </div>
  )
}

function TaskName() {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
      <div>
        <Label htmlFor="taskName">任务名称</Label>
        <Input
            {...register("taskName")}
            id="taskName"
            type="text"
            placeholder="输入任务名称"
            className="mt-1"
        />

        {errors["taskName"] && <ShowError label="taskName" errors={errors} />}
      </div>
  )
}

function TaskPriority() {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext()

  const { isTaskDialogOpened, taskSelected } = useTasksStore()

  const selectedPriority = watch("priority") || "low"

  useEffect(() => {
    if (isTaskDialogOpened && !taskSelected) {
      setValue("priority", "low")
      trigger("priority") // 如果需要，验证表单
    }
  }, [isTaskDialogOpened, trigger])

  // 处理 onValueChange 并触发验证
  const handlePriorityChange = (value: string) => {
    setValue("priority", value) // 更新值
    trigger("priority") // 触发 "priority" 的验证
  }

  return (
      <div>
        <Label className="mb-1">优先级</Label>

        <Select value={selectedPriority} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="选择优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="low" className="">
                <div className="flex items-center gap-1 ">
                  <FaCircle className="text-[12px] text-green-600" />
                  <span>低</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-1 ">
                  <FaCircle className="text-[12px] text-yellow-600" />
                  <span>中</span>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-1 ">
                  <FaCircle className="text-[12px] text-red-600" />
                  <span>高</span>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors["priority"] && <ShowError label="priority" errors={errors} />}
      </div>
  )
}

function TaskStatus() {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext()

  const { isTaskDialogOpened, taskSelected } = useTasksStore()

  const selectedStatus = watch("status") || "in progress"

  // 打开任务对话框时设置为“进行中”状态
  useEffect(() => {
    if (isTaskDialogOpened && !taskSelected) {
      setValue("status", "in progress")
      trigger("status") // 如果需要，验证表单
    }
  }, [isTaskDialogOpened, trigger]) // 依赖确保在对话框打开时运行

  function handleStatusChange(value: string) {
    setValue("status", value)
    trigger("status") // 在更改时验证状态字段
  }

  return (
      <div>
        <Label className="mb-1">选择状态</Label>
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="in progress">进行中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors["status"] && <ShowError label="status" errors={errors} />}
      </div>
  )
}

function ShowError({
                     label,
                     errors,
                   }: {
  errors: FieldErrors<FieldValues>
  label: string
}) {
  return (
      <div className="flex items-center gap-1 text-red-500 mt-2">
        <BiSolidError className="text-sm" />
        <p className="text-red-500 text-sm">
          <>{errors[label]?.message}</>
        </p>
      </div>
  )
}
