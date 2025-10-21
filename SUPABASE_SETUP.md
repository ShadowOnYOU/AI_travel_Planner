# 快速解决数据库表问题

## 问题
错误信息：`Could not find the table 'public.travel_itineraries' in the schema cache`

这表示你的 Supabase 数据库中还没有创建 `travel_itineraries` 表。

## 解决方案

### 选项 1: 创建 Supabase 表（推荐）

1. **登录 Supabase 控制台**
   - 访问 [app.supabase.com](https://app.supabase.com)
   - 进入你的项目

2. **创建数据库表**
   - 点击左侧菜单的 "SQL Editor"
   - 复制以下 SQL 代码并执行：

```sql
-- 创建旅行行程表
CREATE TABLE travel_itineraries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL DEFAULT 1,
    travelers INTEGER DEFAULT 1,
    total_budget DECIMAL(10,2) DEFAULT 0,
    actual_cost DECIMAL(10,2) DEFAULT 0,
    travel_style TEXT DEFAULT '',
    days JSONB DEFAULT '[]'::jsonb,
    summary TEXT DEFAULT '',
    recommendations JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'completed', 'cancelled')),
    tags JSONB DEFAULT '[]'::jsonb,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_travel_itineraries_user_id ON travel_itineraries(user_id);

-- 启用行级安全
ALTER TABLE travel_itineraries ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "Users can only see their own itineraries" ON travel_itineraries
    FOR ALL USING (auth.uid()::text = user_id);
```

3. **验证表创建**
   - 在 "Table Editor" 中查看是否有 `travel_itineraries` 表
   - 刷新页面重新测试应用

### 选项 2: 使用 localStorage（临时方案）

如果你暂时不想设置 Supabase，代码现在会自动降级到 localStorage。你会看到类似这样的日志：

```
数据库表不存在，降级使用 localStorage
```

### 选项 3: 配置环境变量

确保 `.env.local` 文件存在并包含正确的 Supabase 配置：

```bash
# 复制示例文件
cp .env.local.example .env.local

# 编辑文件，填入真实的值
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 验证设置

1. 重启开发服务器：`npm run dev`
2. 访问 http://localhost:3000/itinerary
3. 检查控制台日志：
   - 如果看到 "Supabase 保存成功" = 数据库工作正常
   - 如果看到 "降级使用 localStorage" = 使用本地存储

## 获取 Supabase 凭据

1. 在 Supabase 项目仪表板
2. 点击 "Settings" → "API"
3. 复制：
   - Project URL
   - anon public key

## 常见问题

- **Q: 表创建后还是报错？**
  A: 检查 RLS 政策是否正确设置，确保用户已登录

- **Q: 如何验证表是否创建成功？**  
  A: 在 Supabase 的 "Table Editor" 中查看

- **Q: 可以先使用 localStorage 吗？**
  A: 可以，代码会自动降级，但数据只存在本地