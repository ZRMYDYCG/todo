import { FaCheckDouble } from "react-icons/fa6"

export const description =
    "一个简单的登录表单，包含电子邮件和密码。提交按钮显示 '登录'。"

export function AppLogo() {
    return (
        <div className="flex gap-2 items-center mb-11 justify-center">
            <div className="bg-primary p-2 text-white rounded-sm text-lg">
                <FaCheckDouble />
            </div>

            <div className="font-bold text-2xl flex gap-1 justify-center items-center">
                <span className="text-primary">快速</span>
                <span>任务</span>
            </div>
        </div>
    )
}
