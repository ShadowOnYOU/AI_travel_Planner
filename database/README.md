# Supabase 数据库设置指南

## 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 创建新账户或登录
3. 创建新项目
4. 记录项目 URL 和 API Key

## 2. 执行数据库脚本

1. 在 Supabase 项目仪表板中，进入 SQL Editor
2. 复制 `/database/schema.sql` 文件的内容
3. 在 SQL Editor 中粘贴并执行脚本
4. 确认表创建成功

## 3. 配置环境变量

1. 复制 `.env.local.example` 为 `.env.local`
2. 填入真实的 Supabase 配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. 表结构说明

### travel_itineraries 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(255) | 主键，行程唯一标识 |
| user_id | VARCHAR(255) | 用户 ID，关联认证用户 |
| title | VARCHAR(500) | 行程标题 |
| destination | VARCHAR(255) | 目的地 |
| start_date | DATE | 开始日期 |
| end_date | DATE | 结束日期 |
| total_days | INTEGER | 总天数 |
| travelers | INTEGER | 旅行人数 |
| total_budget | DECIMAL(10,2) | 预算 |
| actual_cost | DECIMAL(10,2) | 实际花费 |
| travel_style | VARCHAR(100) | 旅行风格 |
| days | JSONB | 每日行程安排 |
| summary | TEXT | 行程摘要 |
| recommendations | JSONB | 推荐内容 |
| status | VARCHAR(50) | 状态 (draft/confirmed/completed/cancelled) |
| tags | JSONB | 标签数组 |
| is_public | BOOLEAN | 是否公开 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 5. 安全策略

- 启用了 Row Level Security (RLS)
- 用户只能访问自己创建的行程
- 自动更新 updated_at 字段

## 6. 验证设置

启动应用后，在行程页面尝试保存行程，检查控制台日志：
- 如果看到 "Supabase 保存成功" 表示配置正确
- 如果看到 "Supabase 实现待完成" 表示需要检查配置

## 7. 故障排除

### 常见问题

1. **连接失败**
   - 检查 URL 和 API Key 是否正确
   - 确认环境变量文件名为 `.env.local`

2. **权限错误**
   - 确认已执行完整的 SQL 脚本
   - 检查 RLS 策略是否正确设置

3. **数据不显示**
   - 检查用户是否已登录
   - 确认 user_id 与认证用户匹配

## 8. 测试数据

可以在 SQL Editor 中插入测试数据：

```sql
INSERT INTO travel_itineraries (
    id, user_id, title, destination, start_date, end_date, 
    total_days, travelers, total_budget, summary, status
) VALUES (
    'test_' || generate_random_uuid(), 
    auth.uid()::text, 
    '测试行程', 
    '北京', 
    '2024-12-01', 
    '2024-12-03', 
    3, 2, 5000, 
    '这是一个测试行程', 
    'draft'
);
```