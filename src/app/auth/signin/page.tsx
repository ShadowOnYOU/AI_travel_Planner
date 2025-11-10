'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 表单验证
    if (!email || !password) {
      setError('请填写邮箱和密码')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址')
      setLoading(false)
      return
    }

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error)
      } else {
        // 登录成功后跳转到首页，让用户选择下一步操作
        router.push('/')
      }
    } catch (error) {
      setError('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* 返回首页链接 */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </div>

        {/* 主要登录卡片 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-8">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">✈️</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              欢迎回来
            </h2>
            <p className="text-gray-600">
              登录您的AI Travel Planner账户
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-900 mb-2">
                  邮箱地址
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ color: '#111827' }}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:border-gray-400"
                  placeholder="请输入您的邮箱地址"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ color: '#111827' }}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:border-gray-400"
                  placeholder="请输入您的密码"
                />
              </div>
            </div>

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-xl ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-2xl hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  登录中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  立即登录
                </div>
              )}
            </button>
          </form>

          {/* 注册链接 */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">还没有账户？</p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}