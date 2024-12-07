"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "./app/stores/useUserStore";
import { IoMdLogOut } from "react-icons/io";

export function LogoutButton() {
  const router = useRouter(); // 获取路由对象
  const { handleLogout, isLoading } = useUserStore(); // 从用户存储中获取登出函数和加载状态

  // 将登出处理与导航逻辑合并
  const handleLogoutWithRedirect = async () => {
    await handleLogout(); // 调用存储中的登出函数
    router.push("/"); // 登出后重定向到主页
  };

  return (
    <div
      onClick={handleLogoutWithRedirect} // 点击时执行登出及重定向
      className="font-semibold text-primary flex items-center gap-1 "
    >
      <IoMdLogOut className="text-lg" /> {/* 显示登出图标 */}
      <span> {isLoading ? "loading..." : "logout"}</span> {/* 根据加载状态显示文本 */}
    </div>
  );
}
