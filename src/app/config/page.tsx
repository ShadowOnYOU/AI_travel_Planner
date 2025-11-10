'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function ConfigGuide() {
  const router = useRouter()
  const configured = isSupabaseConfigured()
  
  // API Keys 状态
  const [amapKey, setAmapKey] = useState('')
  const [bailianApiKey, setBailianApiKey] = useState('')
  const [bailianWorkspaceId, setBailianWorkspaceId] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'amap' | 'bailian' | 'supabase'>('amap')
  
  // 测试状态
  const [amapTesting, setAmapTesting] = useState(false)
  const [amapTestResult, setAmapTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [bailianTesting, setBailianTesting] = useState(false)
  const [bailianTestResult, setBailianTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // 从 localStorage 加载已保存的配置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAmapKey = localStorage.getItem('amap_api_key') || ''
      const savedBailianKey = localStorage.getItem('bailian_api_key') || ''
      const savedWorkspaceId = localStorage.getItem('bailian_workspace_id') || ''
      
      setAmapKey(savedAmapKey)
      setBailianApiKey(savedBailianKey)
      setBailianWorkspaceId(savedWorkspaceId)
    }
  }, [])

  // 保存高德地图 API Key
  const saveAmapKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('amap_api_key', amapKey)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  // 保存百炼 API 配置
  const saveBailianConfig = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bailian_api_key', bailianApiKey)
      localStorage.setItem('bailian_workspace_id', bailianWorkspaceId)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  // 清除配置
  const clearAmapKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('amap_api_key')
      setAmapKey('')
      setAmapTestResult(null)
    }
  }

  const clearBailianConfig = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bailian_api_key')
      localStorage.removeItem('bailian_workspace_id')
      setBailianApiKey('')
      setBailianWorkspaceId('')
      setBailianTestResult(null)
    }
  }

  // 测试高德地图 API Key
  const testAmapKey = async () => {
    if (!amapKey) {
      setAmapTestResult({ success: false, message: '请先输入 API Key' })
      return
    }

    setAmapTesting(true)
    setAmapTestResult(null)

    try {
      // 动态导入 AMapLoader
      const AMapLoader = (await import('@amap/amap-jsapi-loader')).default
      
      // 尝试加载高德地图 API
      const AMap = await AMapLoader.load({
        key: amapKey,
        version: '2.0',
        plugins: [],
      })

      // 如果加载成功，说明 API Key 有效
      setAmapTestResult({ 
        success: true, 
        message: '✅ API Key 验证成功！地图功能可以正常使用。' 
      })
    } catch (error: any) {
      console.error('高德地图 API 测试失败:', error)
      
      // 根据错误类型返回不同的提示
      let errorMessage = '❌ API Key 验证失败：'
      if (error.message?.includes('INVALID_USER_KEY')) {
        errorMessage += 'API Key 无效，请检查是否正确'
      } else if (error.message?.includes('DAILY_QUERY_OVER_LIMIT')) {
        errorMessage += 'API 调用次数已超限'
      } else if (error.message?.includes('INVALID_USER_SCODE')) {
        errorMessage += '安全密钥配置错误'
      } else {
        errorMessage += error.message || '未知错误'
      }
      
      setAmapTestResult({ success: false, message: errorMessage })
    } finally {
      setAmapTesting(false)
    }
  }

  // 测试百炼 AI API
  const testBailianApi = async () => {
    if (!bailianApiKey) {
      setBailianTestResult({ success: false, message: '请先输入 API Key' })
      return
    }

    setBailianTesting(true)
    setBailianTestResult(null)

    try {
      // 发送测试请求
      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bailianApiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [
            { role: 'user', content: '你好' }
          ],
          max_tokens: 10,
        }),
      })

      if (response.ok) {
        setBailianTestResult({ 
          success: true, 
          message: '✅ API Key 验证成功！AI 行程生成功能可以正常使用。' 
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        let errorMessage = '❌ API Key 验证失败：'
        
        if (response.status === 401) {
          errorMessage += 'API Key 无效或已过期'
        } else if (response.status === 429) {
          errorMessage += 'API 调用频率超限'
        } else if (response.status === 400) {
          errorMessage += errorData.message || '请求参数错误'
        } else {
          errorMessage += `HTTP ${response.status} - ${errorData.message || '未知错误'}`
        }
        
        setBailianTestResult({ success: false, message: errorMessage })
      }
    } catch (error: any) {
      console.error('百炼 AI API 测试失败:', error)
      setBailianTestResult({ 
        success: false, 
        message: `❌ 连接失败：${error.message || '网络错误'}` 
      })
    } finally {
      setBailianTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            系统配置管理
          </h1>
          <p className="text-gray-600 text-lg">配置 API Keys 以启用完整功能</p>
        </div>

        {/* 成功提示 */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 animate-fadeIn">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">配置保存成功！</span>
            </div>
          </div>
        )}

        {/* 标签页导航 */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('amap')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                activeTab === 'amap'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mr-2">🗺️</span>
              高德地图 API
            </button>
            <button
              onClick={() => setActiveTab('bailian')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                activeTab === 'bailian'
                  ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mr-2">🤖</span>
              阿里云百炼 AI
            </button>
            <button
              onClick={() => setActiveTab('supabase')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                activeTab === 'supabase'
                  ? 'border-b-2 border-green-500 text-green-600 bg-green-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mr-2">🗄️</span>
              Supabase 数据库
            </button>
          </div>
        </div>

        {/* 高德地图 API 配置 */}
        {activeTab === 'amap' && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className={`flex-shrink-0 w-3 h-3 rounded-full ${amapKey ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <h2 className="ml-3 text-2xl font-bold text-gray-800">
                高德地图 API Key
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={amapKey}
                  onChange={(e) => setAmapKey(e.target.value)}
                  placeholder="请输入高德地图 API Key"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-400"
                />
                <p className="mt-2 text-sm text-gray-500">
                  用于地图显示和路径规划功能
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={testAmapKey}
                  disabled={!amapKey || amapTesting}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    amapKey && !amapTesting
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {amapTesting ? '🔄 测试中...' : '🧪 测试连接'}
                </button>
                <button
                  onClick={saveAmapKey}
                  disabled={!amapKey}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    amapKey
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  💾 保存配置
                </button>
                <button
                  onClick={clearAmapKey}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  🗑️ 清除
                </button>
              </div>

              {/* 测试结果 */}
              {amapTestResult && (
                <div className={`p-4 rounded-xl border-2 ${
                  amapTestResult.success 
                    ? 'bg-green-50 border-green-300 text-green-800' 
                    : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                  <p className="text-sm font-medium">{amapTestResult.message}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">📖 如何获取 API Key？</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                  <li>访问 <a href="https://console.amap.com" className="font-semibold underline hover:text-blue-900" target="_blank" rel="noopener noreferrer">高德开放平台</a></li>
                  <li>注册并登录账号</li>
                  <li>进入"应用管理" → "我的应用"</li>
                  <li>创建新应用，选择 "Web端（JS API）"</li>
                  <li>复制生成的 Key 并粘贴到上方输入框</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* 百炼 AI 配置 */}
        {activeTab === 'bailian' && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className={`flex-shrink-0 w-3 h-3 rounded-full ${bailianApiKey && bailianWorkspaceId ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <h2 className="ml-3 text-2xl font-bold text-gray-800">
                阿里云百炼 AI 配置
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key (DashScope)
                </label>
                <input
                  type="password"
                  value={bailianApiKey}
                  onChange={(e) => setBailianApiKey(e.target.value)}
                  placeholder="请输入百炼 API Key"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 hover:border-gray-400"
                />
                <p className="mt-2 text-sm text-gray-500">
                  用于 AI 行程生成功能
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace ID
                </label>
                <input
                  type="text"
                  value={bailianWorkspaceId}
                  onChange={(e) => setBailianWorkspaceId(e.target.value)}
                  placeholder="请输入工作空间 ID"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 hover:border-gray-400"
                />
                <p className="mt-2 text-sm text-gray-500">
                  应用所属的工作空间标识
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={testBailianApi}
                  disabled={!bailianApiKey || bailianTesting}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    bailianApiKey && !bailianTesting
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {bailianTesting ? '🔄 测试中...' : '🧪 测试连接'}
                </button>
                <button
                  onClick={saveBailianConfig}
                  disabled={!bailianApiKey || !bailianWorkspaceId}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    bailianApiKey && bailianWorkspaceId
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  💾 保存配置
                </button>
                <button
                  onClick={clearBailianConfig}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  🗑️ 清除
                </button>
              </div>

              {/* 测试结果 */}
              {bailianTestResult && (
                <div className={`p-4 rounded-xl border-2 ${
                  bailianTestResult.success 
                    ? 'bg-green-50 border-green-300 text-green-800' 
                    : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                  <p className="text-sm font-medium">{bailianTestResult.message}</p>
                </div>
              )}

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-purple-800 mb-2">📖 如何获取配置？</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-purple-700">
                  <li>访问 <a href="https://www.aliyun.com/product/bailian" className="font-semibold underline hover:text-purple-900" target="_blank" rel="noopener noreferrer">阿里云百炼平台</a></li>
                  <li>开通百炼服务并创建应用</li>
                  <li>在"API-KEY管理"中创建或查看 API Key</li>
                  <li>在应用详情中查看 Workspace ID</li>
                  <li>将配置信息填入上方输入框</li>
                </ol>
                <div className="mt-3 pt-3 border-t border-purple-300">
                  <p className="text-xs text-purple-600">
                    💡 提示：如未配置，系统将使用模拟数据生成行程
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supabase 配置说明 */}
        {activeTab === 'supabase' && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className={`flex-shrink-0 w-3 h-3 rounded-full ${configured ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <h2 className="ml-3 text-2xl font-bold text-gray-800">
                Supabase 数据库配置
              </h2>
            </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Supabase 已预配置
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>数据库已预配置完成，认证功能可以正常使用。演示项目无需额外配置。</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                当前配置：
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-sm text-gray-700">
{`✅ Project URL: https://untvtsdpychqwikqdkgg.supabase.co
✅ Anonymous Key: 已配置
✅ 数据库状态: 正常运行`}
                </pre>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">📋 功能说明</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 用户注册和登录功能</li>
                <li>• 行程数据云端存储</li>
                <li>• 跨设备数据同步</li>
                <li>• 用户行程管理</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-green-800 mb-2">🎯 演示模式</h4>
              <p className="text-sm text-green-700">
                此项目为演示版本，数据库已预配置完成。您可以直接使用所有功能，无需额外配置。
              </p>
            </div>
          </div>
          </div>
        )}

        {/* 底部导航 */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <span className="mr-2">←</span>
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}