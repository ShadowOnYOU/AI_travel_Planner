'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const configured = isSupabaseConfigured()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          AI Travel Planner
        </h1>
        <div className="flex items-center space-x-4">
          {!configured ? (
            <Link
              href="/config"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              配置数据库
            </Link>
          ) : user ? (
            <>
              <span className="text-sm text-gray-600">
                欢迎, {user.email}
              </span>
              <Link
                href="/itinerary"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                我的行程
              </Link>
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-800"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:text-blue-700"
              >
                登录
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="relative flex place-items-center py-16">
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h2 className="mb-6 text-3xl font-semibold">
            欢迎使用 AI Travel Planner
          </h2>
          
          {!configured ? (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 mb-2">
                🚀 项目初始化完成！
              </p>
              <p className="text-sm text-yellow-700">
                要使用认证功能，请先配置 Supabase 数据库
              </p>
            </div>
          ) : user ? (
            <div className="space-y-6">
              <p className="text-lg text-gray-600 mb-8">
                👋 欢迎回来！准备开始您的下一次旅行规划吗？
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <Link 
                  href="/plan"
                  className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors group"
                >
                  <div className="text-3xl mb-3">✈️</div>
                  <h3 className="text-lg font-semibold mb-2">创建新行程</h3>
                  <p className="text-sm opacity-90">使用AI智能规划您的完美旅行</p>
                </Link>
                
                <Link 
                  href="/itinerary"
                  className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition-colors group"
                >
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="text-lg font-semibold mb-2">我的行程</h3>
                  <p className="text-sm opacity-90">查看和管理已保存的行程</p>
                </Link>
                
                <Link 
                  href="/budget"
                  className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition-colors group"
                >
                  <div className="text-3xl mb-3">💰</div>
                  <h3 className="text-lg font-semibold mb-2">费用管理</h3>
                  <p className="text-sm opacity-90">记录和分析旅行开支</p>
                </Link>
                
                <Link 
                  href="/test/speech"
                  className="bg-orange-600 text-white p-6 rounded-xl hover:bg-orange-700 transition-colors group"
                >
                  <div className="text-3xl mb-3">🎤</div>
                  <h3 className="text-lg font-semibold mb-2">语音测试</h3>
                  <p className="text-sm opacity-90">测试语音识别功能</p>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-lg text-gray-600 mb-8">
                让AI为您量身定制完美的旅行计划 ✨
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  立即开始规划
                </Link>
                <Link
                  href="/auth/signin"
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 font-medium"
                >
                  已有账户登录
                </Link>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/test/web-speech"
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 font-medium inline-flex items-center gap-2"
                  >
                    🌐 Web语音识别
                  </Link>
                  <Link
                    href="/test/speech"
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium inline-flex items-center gap-2"
                  >
                    � 讯飞语音识别
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link 
          href="/test/web-speech"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            语音输入 {' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              🎤
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            支持语音输入旅行需求，让规划更加便捷
          </p>
          <p className="mt-2 text-xs text-green-600 font-medium">
            👆 点击测试Web语音识别
          </p>
        </Link>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            AI规划 {' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              🤖
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            智能分析需求，生成个性化旅行路线
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            地图导航 {' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              🗺️
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            集成地图服务，可视化行程路线
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            费用管理 {' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              💰
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            智能预算分析，实时费用跟踪
          </p>
        </div>
      </div>
    </main>
  )
}