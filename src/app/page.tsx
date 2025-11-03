'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const configured = isSupabaseConfigured()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 导航栏 */}
      <nav className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">✈️</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Travel Planner
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {!configured ? (
                <Link
                  href="/config"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  配置数据库
                </Link>
              ) : user ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    欢迎, {user.email}
                  </span>
                  <Link
                    href="/itinerary"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    我的行程
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    登出
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    登录
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        {/* 英雄区域 */}
        <div className="text-center max-w-6xl mx-auto relative z-10">
          <div className="mb-8">
            <h2 className="mb-6 text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              欢迎使用 AI Travel Planner
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              让人工智能为您量身定制完美的旅行计划 ✨
            </p>
          </div>
          
          {!configured ? (
            <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl">🚀</span>
              </div>
              <p className="text-yellow-800 mb-2 font-semibold text-lg">
                项目初始化完成！
              </p>
              <p className="text-yellow-700">
                要使用完整功能，请先配置 Supabase 数据库
              </p>
            </div>
          ) : user ? (
            <div className="space-y-8">
              <p className="text-xl text-gray-600 mb-12">
                👋 欢迎回来！准备开始您的下一次旅行规划吗？
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
                <Link 
                  href="/plan"
                  className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">✈️</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">创建新行程</h3>
                    <p className="text-gray-600 leading-relaxed">使用AI智能规划您的完美旅行</p>
                    <div className="mt-4 inline-flex items-center text-blue-500 font-medium group-hover:text-blue-600">
                      开始规划 
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  href="/itinerary"
                  className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📋</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-green-600 transition-colors">我的行程</h3>
                    <p className="text-gray-600 leading-relaxed">查看和管理已保存的行程</p>
                    <div className="mt-4 inline-flex items-center text-green-500 font-medium group-hover:text-green-600">
                      查看行程
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  href="/map"
                  className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🗺️</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">地图导航</h3>
                    <p className="text-gray-600 leading-relaxed">可视化行程路线和地点</p>
                    <div className="mt-4 inline-flex items-center text-purple-500 font-medium group-hover:text-purple-600">
                      查看地图
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  href="/plan"
                  className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎤</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">语音识别</h3>
                    <p className="text-gray-600 leading-relaxed">语音输入旅行需求</p>
                    <div className="mt-4 inline-flex items-center text-orange-500 font-medium group-hover:text-orange-600">
                      开始规划
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <Link
                  href="/auth/signup"
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center">
                    立即开始规划
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                  </span>
                </Link>
                <Link
                  href="/auth/signin"
                  className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-500 hover:text-blue-600 font-semibold text-lg transition-all duration-300 hover:shadow-lg"
                >
                  <span className="flex items-center justify-center">
                    已有账户登录
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </Link>
              </div>
              
              <div className="pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-center">开始您的智能旅行规划之旅</p>
              </div>
            </div>
          )}
        </div>

        {/* 功能特色展示 */}
        <div className="mt-24 mb-16 w-full max-w-7xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">为什么选择我们？</h3>
            <p className="text-xl text-gray-600">先进的AI技术，为您打造完美的旅行体验</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎤</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">智能语音输入</h4>
              <p className="text-gray-600 leading-relaxed">
                支持语音输入旅行需求，让规划更加便捷自然
              </p>
            </div>

            <div className="group text-center p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">AI智能规划</h4>
              <p className="text-gray-600 leading-relaxed">
                智能分析需求，生成个性化旅行路线和建议
              </p>
            </div>

            <div className="group text-center p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🗺️</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">可视化地图</h4>
              <p className="text-gray-600 leading-relaxed">
                集成地图服务，直观展示行程路线和景点
              </p>
            </div>

            <div className="group text-center p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">预算管理</h4>
              <p className="text-gray-600 leading-relaxed">
                智能预算分析，实时费用跟踪和优化建议
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
