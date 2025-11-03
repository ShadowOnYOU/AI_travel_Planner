'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TravelItinerary, DayItinerary, ItineraryItem } from '@/types/ai';
import { ItineraryService } from '@/lib/itinerary-service';
import { useAuth } from '@/contexts/AuthContext';

export default function ItineraryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // 加载行程数据
  useEffect(() => {
    const loadItinerary = async () => {
      try {
        const id = params?.id as string;
        if (id) {
          // 首先尝试从服务获取
          const data = await ItineraryService.getItineraryById(id, user?.id);
          if (data) {
            setItinerary(data);
          } else {
            // 如果没有找到，尝试从当前行程获取
            const current = ItineraryService.getCurrentItinerary();
            if (current && current.id === id) {
              setItinerary(current);
            } else {
              // 都没有找到，重定向到行程列表
              router.push('/itinerary');
              return;
            }
          }
        } else {
          // 没有ID，尝试获取当前行程
          const current = ItineraryService.getCurrentItinerary();
          if (current) {
            setItinerary(current);
          } else {
            router.push('/itinerary');
            return;
          }
        }
      } catch (error) {
        console.error('加载行程数据失败:', error);
        router.push('/itinerary');
        return;
      }
      setLoading(false);
    };

    if (user) {
      loadItinerary();
    } else {
      router.push('/auth/signin');
    }
  }, [user, router, params]);

  // 获取费用类型图标
  const getCostTypeIcon = (type: ItineraryItem['type']) => {
    const icons = {
      attraction: '🎯',
      restaurant: '🍽️',
      hotel: '🏨',
      transport: '🚗',
      activity: '🎪'
    };
    return icons[type] || '📍';
  };

  // 格式化费用
  const formatCost = (cost: number) => {
    return `¥${cost.toLocaleString()}`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 保存为我的行程
  const saveToMyItineraries = async () => {
    if (!itinerary) return;

    try {
      // 确保行程有所有必需的字段
      const savedItinerary: TravelItinerary = {
        ...itinerary,
        status: itinerary.status || 'confirmed',
        tags: itinerary.tags || [itinerary.destination, itinerary.travelStyle],
        isPublic: itinerary.isPublic ?? false,
        userId: user?.id,
        createdAt: itinerary.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await ItineraryService.saveItinerary(savedItinerary, user?.id);
      
      alert('行程已保存到我的行程列表！');
      
      // 可选：跳转到行程列表页面确认
      const shouldRedirect = confirm('行程已保存！是否跳转到我的行程列表查看？');
      if (shouldRedirect) {
        router.push('/itinerary');
      }
    } catch (error) {
      console.error('保存行程失败:', error);
      alert('保存失败，请稍后重试。请检查控制台获取更多信息。');
    }
  };

  // 编辑行程
  const editItinerary = () => {
    if (!itinerary) return;
    // TODO: 跳转到编辑页面
    router.push(`/itinerary/${itinerary.id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在加载行程...</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到行程数据</h2>
          <button
            onClick={() => router.push('/itinerary')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            返回行程列表
          </button>
        </div>
      </div>
    );
  }

  const currentDay = itinerary.days.find(day => day.day === selectedDay);

  return (
    <div className="min-h-screen bg-gray-50">
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
              <button
                onClick={() => router.push('/itinerary')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                返回列表
              </button>
              <button
                onClick={() => router.push(`/itinerary/${params.id}/map`)}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                🗺️ 查看地图
              </button>
              <button
                onClick={saveToMyItineraries}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                保存行程
              </button>
              <button
                onClick={editItinerary}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                编辑行程
              </button>
              <span className="text-gray-600">
                欢迎，{user?.email}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 行程标题 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {itinerary.title}
            </h1>
            <p className="text-lg text-gray-600">
              {itinerary.destination} • {itinerary.totalDays}天 • {itinerary.travelers}人
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
            </p>
          </div>

          {/* 预算概览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCost(itinerary.totalBudget)}
              </div>
              <div className="text-sm text-gray-600">总预算</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCost(itinerary.actualCost)}
              </div>
              <div className="text-sm text-gray-600">预计花费</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCost(itinerary.totalBudget - itinerary.actualCost)}
              </div>
              <div className="text-sm text-gray-600">剩余预算</div>
            </div>
          </div>

          {/* 行程概要 */}
          <div className="text-center">
            <p className="text-gray-700 leading-relaxed">
              {itinerary.summary}
            </p>
          </div>

          {/* 标签 */}
          {itinerary.tags && itinerary.tags.length > 0 && (
            <div className="flex justify-center flex-wrap gap-2 mt-4">
              {itinerary.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 日程导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">日程安排</h3>
              <div className="space-y-2">
                {itinerary.days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedDay === day.day
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">第{day.day}天</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(day.date)}
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {formatCost(day.totalCost)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 推荐提示 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 旅行提示</h3>
              <div className="space-y-3">
                {itinerary.recommendations.map((tip, index) => (
                  <div key={index} className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 主要内容 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  第{selectedDay}天 - {formatDate(currentDay?.date || '')}
                </h2>
                <div className="text-lg font-medium text-green-600">
                  {formatCost(currentDay?.totalCost || 0)}
                </div>
              </div>

              {currentDay && (
                <div className="space-y-4">
                  {/* 当天概要 */}
                  <div className="p-4 bg-blue-50 rounded-lg mb-6">
                    <p className="text-blue-800 leading-relaxed">{currentDay.summary}</p>
                  </div>

                  {/* 详细行程 */}
                  <div className="space-y-4">
                    {currentDay.items.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="text-2xl">{getCostTypeIcon(item.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                <span className="text-sm font-medium text-blue-600">{item.time}</span>
                              </div>
                              <p className="text-gray-600 mb-2">{item.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>📍 {item.location}</span>
                                <span>⏱️ {item.duration}分钟</span>
                                <span className="font-medium text-green-600">{formatCost(item.cost)}</span>
                              </div>
                              {item.notes && (
                                <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                                  💡 {item.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!currentDay && (
                <div className="text-center py-12">
                  <p className="text-gray-500">该天暂无安排</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}