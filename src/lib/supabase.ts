import { createClient } from '@supabase/supabase-js'

// 检查是否有有效的环境变量
export const isSupabaseConfigured = () => {
  // 演示项目：Supabase 已预配置，始终返回 true
  return true
  
  // 如果需要检查实际配置，可以使用以下代码：
  // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // return supabaseUrl && supabaseKey && 
  //        supabaseUrl !== 'your_supabase_url_here' &&
  //        supabaseUrl.startsWith('https://')
}

// 创建一个虚拟的 Supabase 客户端用于开发
const createDummyClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // 立即调用一次回调，返回未认证状态
      if (callback) {
        setTimeout(() => callback('SIGNED_OUT', null), 0);
      }
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      };
    },
    signInWithPassword: () => Promise.resolve({ 
      data: { user: null, session: null },
      error: { message: 'Supabase 未配置，请在设置页面配置数据库' } 
    }),
    signUp: () => Promise.resolve({ 
      data: { user: null, session: null },
      error: { message: 'Supabase 未配置，请在设置页面配置数据库' } 
    }),
    signOut: () => Promise.resolve({ error: null }),
    refreshSession: () => Promise.resolve({ data: { session: null }, error: null }),
    setSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  })
})

// 获取 Supabase 客户端，确保构建时使用默认值
export function getSupabaseClient() {
  // 在构建时使用默认的演示配置，与 docker-compose.yml 保持一致
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://untvtsdpychqwikqdkgg.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudHZ0c2RweWNocXdpa3Fka2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjM4NjQsImV4cCI6MjA3NjEzOTg2NH0.3lTm4PFwCxxKWgjE5YFP90I0oQgNKn-scOKCOqitIWs'
  
  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Supabase 客户端初始化失败，使用虚拟客户端:', error)
    return createDummyClient() as any
  }
}

// 导出客户端实例
export const supabase = getSupabaseClient()