/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 允许从环境变量或 localStorage 读取配置
  env: {
    NEXT_PUBLIC_AMAP_KEY: process.env.NEXT_PUBLIC_AMAP_KEY || '',
    NEXT_PUBLIC_BAILIAN_API_KEY: process.env.NEXT_PUBLIC_BAILIAN_API_KEY || '',
    NEXT_PUBLIC_BAILIAN_WORKSPACE_ID: process.env.NEXT_PUBLIC_BAILIAN_WORKSPACE_ID || '',
    NEXT_PUBLIC_BAILIAN_BASE_URL: process.env.NEXT_PUBLIC_BAILIAN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    NEXT_PUBLIC_BAILIAN_MODEL_ID: process.env.NEXT_PUBLIC_BAILIAN_MODEL_ID || 'qwen-plus',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://untvtsdpychqwikqdkgg.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudHZ0c2RweWNocXdpa3Fka2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjM4NjQsImV4cCI6MjA3NjEzOTg2NH0.3lTm4PFwCxxKWgjE5YFP90I0oQgNKn-scOKCOqitIWs',
  },
  // 忽略 ESLint 和 TypeScript 错误在构建时
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig