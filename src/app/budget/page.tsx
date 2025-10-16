'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function BudgetPage() {
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
              <span className="text-gray-600">费用管理</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">欢迎, {user.email}</span>
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
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            旅行费用管理
          </h1>
          <p className="text-gray-600">
            智能预算分析和实时开支记录
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              费用管理功能即将上线
            </h2>
            <p className="text-gray-600 mb-6">
              包含AI预算估算、语音记账、实时费用跟踪等强大功能
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">AI预算估算</h3>
                <p className="text-sm text-gray-600">根据目的地、天数和偏好智能估算各项费用</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">语音记账</h3>
                <p className="text-sm text-gray-600">支持语音输入快速记录旅行开支</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">分类统计</h3>
                <p className="text-sm text-gray-600">按交通、住宿、餐饮、景点等分类分析</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">实时对比</h3>
                <p className="text-sm text-gray-600">实时对比预算与实际支出差异</p>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-flex items-center"
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