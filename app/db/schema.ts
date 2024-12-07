import { text, pgTable, timestamp, pgEnum } from "drizzle-orm/pg-core"

// 定义优先级和状态的枚举
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"])
export const statusEnum = pgEnum("status", ["in progress", "completed"])

export const userTable = pgTable("userTable", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hash_password: text("hash_password").notNull(),
})

// 任务表（使用枚举定义优先级和状态）
export const tasksTable = pgTable("tasksTable", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  priority: priorityEnum("priority").notNull(), // 使用枚举定义优先级
  status: statusEnum("status").notNull(), // 使用枚举定义状态
  userId: text("user_id")
      .notNull()
      .references(() => userTable.id), // 链接到创建任务的用户
})

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})
