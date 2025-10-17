'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
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
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                AI Travel Planner
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">欢迎, {user.email}</span>
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-800"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* 快捷操作 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  快捷操作
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/plan/new"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">✈️</div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
                        创建新行程
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        开始规划您的下一次旅行
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/budget"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors group"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">💰</div>
                      <h3 className="font-medium text-gray-900 group-hover:text-purple-700">
                        费用管理
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        记录和分析旅行开支
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  我的统计
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">总行程数</span>
                    <span className="font-semibold text-blue-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">已完成</span>
                    <span className="font-semibold text-green-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">进行中</span>
                    <span className="font-semibold text-orange-600">0</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  开发进度
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">用户认证</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">语音识别</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-600">AI规划</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 最近的行程 */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  最近的行程
                </h2>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">📋</div>
                  <p className="text-gray-500">
                    暂无行程记录，<Link href="/plan/new" className="text-blue-600 hover:text-blue-700">创建您的第一个行程</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}