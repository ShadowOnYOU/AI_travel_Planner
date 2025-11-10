'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function NewPlanPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                AI Travel Planner
              </Link>
              <span className="text-gray-300">→</span>
              <span className="text-gray-600 dark:text-gray-300">创建新行程</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">欢迎, {user.email}</span>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            创建新的旅行计划
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            告诉我们您的旅行需求，AI 将为您生成完美的行程安排
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              ✨ 智能行程规划
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              我们的 AI 助手将根据您的偏好，为您量身定制最适合的旅行方案
            </p>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ 用户认证系统</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>🔄 语音识别组件 (进行中)</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>⏳ 旅行需求表单</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>⏳ AI行程生成</span>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}