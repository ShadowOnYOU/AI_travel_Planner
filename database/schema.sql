-- 旅行行程表
CREATE TABLE travel_itineraries (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    travelers INTEGER DEFAULT 1,
    total_budget DECIMAL(10,2) DEFAULT 0,
    actual_cost DECIMAL(10,2) DEFAULT 0,
    travel_style VARCHAR(100),
    days JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    recommendations JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'completed', 'cancelled')),
    tags JSONB DEFAULT '[]'::jsonb,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_travel_itineraries_user_id ON travel_itineraries(user_id);
CREATE INDEX idx_travel_itineraries_destination ON travel_itineraries(destination);
CREATE INDEX idx_travel_itineraries_status ON travel_itineraries(status);
CREATE INDEX idx_travel_itineraries_start_date ON travel_itineraries(start_date);
CREATE INDEX idx_travel_itineraries_created_at ON travel_itineraries(created_at);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_travel_itineraries_updated_at
    BEFORE UPDATE ON travel_itineraries
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- 启用 Row Level Security (RLS)
ALTER TABLE travel_itineraries ENABLE ROW LEVEL SECURITY;

-- 创建安全策略：用户只能访问自己的行程
CREATE POLICY travel_itineraries_policy ON travel_itineraries
    FOR ALL USING (auth.uid()::text = user_id);

-- 允许用户插入自己的行程
CREATE POLICY travel_itineraries_insert_policy ON travel_itineraries
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- 允许用户更新自己的行程
CREATE POLICY travel_itineraries_update_policy ON travel_itineraries
    FOR UPDATE USING (auth.uid()::text = user_id);

-- 允许用户删除自己的行程
CREATE POLICY travel_itineraries_delete_policy ON travel_itineraries
    FOR DELETE USING (auth.uid()::text = user_id);