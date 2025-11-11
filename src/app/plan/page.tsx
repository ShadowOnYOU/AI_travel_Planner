'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TravelRequirements } from '@/types/travel';
import { AIGenerationResponse } from '@/types/ai';
import TravelForm from '@/components/TravelForm';
import { useAuth } from '@/contexts/AuthContext';

export default function PlanPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  // 如果用户未登录，重定向到登录页面
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  // 处理表单提交
  const handleSubmit = async (data: TravelRequirements) => {
    try {
      setIsGenerating(true);
      
      // 调用AI API生成行程
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: AIGenerationResponse = await response.json();
      
      if (result.success && result.data) {
        
        // 确保行程有正确的用户ID和状态
        const itinerary = {
          ...result.data,
          userId: user?.id,
          status: 'draft' as const,
          tags: [result.data.destination, result.data.travelStyle],
          isPublic: false
        };
        
        // 将行程数据保存到localStorage作为当前行程
        localStorage.setItem('currentItinerary', JSON.stringify(itinerary));
        
        // 跳转到行程详情页面（使用新的详情路由）
        router.push(`/itinerary/${itinerary.id}`);
      } else {
        throw new Error(result.error || '生成行程失败');
      }
      
    } catch (error) {
      console.error('生成行程失败:', error);
      alert(error instanceof Error ? error.message : '生成行程失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 导航栏 */}
      <nav className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✈️</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                  AI Travel Planner
                </h1>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.email && (
                <span className="text-sm text-gray-600 hidden sm:inline">
                  欢迎，{user.email}
                </span>
              )}
              <button
                onClick={() => router.push('/itinerary')}
                className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                我的行程
              </button>
              <button
                onClick={() => router.push('/config')}
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                title="系统配置"
              >
                ⚙️
              </button>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              创建新行程
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
              告诉我们您的旅行偏好，AI将为您量身定制完美的行程计划 ✨
            </p>
            
            {/* 操作流程提示 */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 使用流程</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800">填写旅行需求</div>
                      <div className="text-sm text-gray-600">目的地、天数、预算等</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800">AI生成专属行程</div>
                      <div className="text-sm text-gray-600">智能规划路线和景点</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800">保存到个人行程库</div>
                      <div className="text-sm text-gray-600">点击"保存行程"按钮</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-100 rounded-lg border-l-4 border-amber-400">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">💡 重要提示：</span>
                    生成行程后，请务必点击页面上的 
                    <span className="inline-block mx-1 px-2 py-1 bg-green-500 text-white text-xs rounded font-medium">保存行程</span> 
                    按钮，这样才能将行程添加到您的个人行程库中！
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <TravelForm onSubmit={handleSubmit} loading={isGenerating} />
        </div>
      </main>

      {/* 页脚提示 */}
      <footer className="bg-white/70 backdrop-blur-md border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <div className="text-3xl mb-3">🎤</div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">语音输入</h3>
                <p className="text-blue-700 text-sm">使用语音输入可以更快地描述您的旅行偏好</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">AI智能规划</h3>
                <p className="text-purple-700 text-sm">AI将根据您的需求生成个性化的旅行行程</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">全面规划</h3>
                <p className="text-green-700 text-sm">包括景点推荐、路线规划和预算估算</p>
              </div>
            </div>
            <p className="text-gray-600">
              让我们开始您的精彩旅程吧！🌟
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}