-- 简化版旅行行程表（用于快速测试）
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

-- 创建基本索引
CREATE INDEX idx_travel_itineraries_user_id ON travel_itineraries(user_id);

-- 启用 RLS（行级安全）
ALTER TABLE travel_itineraries ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的数据
CREATE POLICY "Users can only see their own itineraries" ON travel_itineraries
    FOR ALL USING (auth.uid()::text = user_id);