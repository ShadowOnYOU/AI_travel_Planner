import { createClient } from '@supabase/supabase-js'

// 检查是否有有效的环境变量
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here' &&
         process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')
}

// 创建一个虚拟的 Supabase 客户端用于开发
const createDummyClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase 未配置' } }),
    signUp: () => Promise.resolve({ error: { message: 'Supabase 未配置' } }),
    signOut: () => Promise.resolve({ error: null }),
  }
})

// 根据配置情况创建客户端
export const supabase = isSupabaseConfigured() 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : createDummyClient() as any