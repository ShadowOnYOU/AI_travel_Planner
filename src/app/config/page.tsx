'use client'

import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function ConfigGuide() {
  const configured = isSupabaseConfigured()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            项目配置指南
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className={`flex-shrink-0 w-4 h-4 rounded-full ${configured ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h2 className="ml-3 text-xl font-semibold text-gray-900">
              Supabase 数据库配置
            </h2>
          </div>

          {!configured ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Supabase 未配置
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>认证功能需要配置 Supabase 数据库。请按以下步骤配置：</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Supabase 已配置
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>数据库连接正常，认证功能可以正常使用。</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                配置步骤：
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>访问 <a href="https://supabase.com" className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">Supabase</a> 创建新项目</li>
                <li>在项目设置中找到 API 配置</li>
                <li>复制 Project URL 和 anon public key</li>
                <li>在项目根目录的 <code className="bg-gray-100 px-1 rounded">.env.local</code> 文件中填入以下配置：</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm">
{`NEXT_PUBLIC_SUPABASE_URL=你的_supabase_项目_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key`}
              </pre>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">💡 提示</h4>
              <p className="text-sm text-blue-700">
                配置完成后，重启开发服务器即可使用完整的认证功能。
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}