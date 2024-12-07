import { useTasksStore } from "@/app/stores/useTasksStore"
import { DeleteDialog } from "../Dialogs/ClearAllDialog/DeleteDialog"

export function TasksFooter() {
    const { tasks } = useTasksStore()
    return (
        <div>
            <div className="flex justify-between mt-5 items-center">
                <p className="text-gray-500 text-sm">{tasks.length} 个任务</p>
                <DeleteDialog />
            </div>
        </div>
    )
}
