'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TravelRequirements } from '@/types/travel';
import TravelForm from '@/components/TravelForm';
import { useAuth } from '@/contexts/AuthContext';

export default function PlanPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  // 如果用户未登录，重定向到登录页面
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  // 处理表单提交
  const handleSubmit = async (data: TravelRequirements) => {
    try {
      console.log('旅行需求数据:', data);
      
      // TODO: 这里将调用AI API生成行程
      // 暂时显示成功消息
      alert('旅行需求已提交，AI正在为您生成行程...');
      
      // TODO: 跳转到行程页面
      // router.push('/itinerary');
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                <span className="text-2xl">✈️</span>
                <span>AI旅行规划师</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                欢迎，{user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TravelForm onSubmit={handleSubmit} />
        </div>
      </main>

      {/* 页脚提示 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              💡 提示：使用语音输入可以更快地描述您的旅行偏好
            </p>
            <p className="text-sm">
              AI将根据您的需求生成个性化的旅行行程，包括景点推荐、路线规划和预算估算
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}