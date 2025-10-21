'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TravelItinerary, ItineraryCollection, ItineraryFilterOptions } from '@/types/ai';
import { ItineraryService } from '@/lib/itinerary-service';
import { useAuth } from '@/contexts/AuthContext';

export default function ItineraryListPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [collection, setCollection] = useState<ItineraryCollection>({
    total: 0,
    itineraries: [],
    page: 1,
    limit: 12
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ItineraryFilterOptions>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // 搜索状态
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TravelItinerary['status'] | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // 加载行程列表
  const loadItineraries = async () => {
    try {
      setLoading(true);
      const result = await ItineraryService.getAllItineraries(user?.id, filters);
      setCollection(result);
    } catch (error) {
      console.error('加载行程列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadItineraries();
    } else {
      router.push('/auth/signin');
    }
  }, [user, filters]);

  // 处理搜索
  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchQuery,
      status: selectedStatus || undefined,
      page: 1
    }));
  };

  // 重置筛选
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  // 删除行程
  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个行程吗？此操作不可撤销。')) {
      try {
        await ItineraryService.deleteItinerary(id, user?.id);
        loadItineraries();
      } catch (error) {
        console.error('删除行程失败:', error);
        alert('删除失败，请稍后重试');
      }
    }
  };

  // 复制行程
  const handleDuplicate = async (id: string) => {
    try {
      await ItineraryService.duplicateItinerary(id, user?.id);
      loadItineraries();
    } catch (error) {
      console.error('复制行程失败:', error);
      alert('复制失败，请稍后重试');
    }
  };

  // 查看行程详情
  const viewItinerary = (itinerary: TravelItinerary) => {
    ItineraryService.setCurrentItinerary(itinerary);
    router.push(`/itinerary/${itinerary.id}`);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 格式化费用
  const formatCost = (cost: number) => {
    return `¥${cost.toLocaleString()}`;
  };

  // 获取状态标签
  const getStatusBadge = (status?: TravelItinerary['status']) => {
    const actualStatus = status || 'draft';
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      draft: '草稿',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[actualStatus]}`}>
        {labels[actualStatus]}
      </span>
    );
  };

  if (loading && collection.itineraries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在加载行程列表...</p>
        </div>
      </div>
    );
  }

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
                onClick={() => router.push('/plan')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                新建行程
              </button>
              <span className="text-gray-600">
                欢迎，{user?.email}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">我的行程</h1>
              <p className="text-gray-600">管理您的所有旅行计划</p>
            </div>
            {/* 调试按钮 */}
            <button
              onClick={() => {
                const stored = localStorage.getItem('travel_itineraries');
                console.log('本地存储的行程数据:', stored);
                if (stored) {
                  console.log('解析后的数据:', JSON.parse(stored));
                }
              }}
              className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600"
            >
              调试存储
            </button>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索行程标题、目的地..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 状态筛选 */}
            <div className="flex-shrink-0">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as TravelItinerary['status'] | '')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">所有状态</option>
                <option value="draft">草稿</option>
                <option value="confirmed">已确认</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                搜索
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                重置
              </button>
            </div>
          </div>
        </div>

        {/* 行程列表 */}
        {collection.itineraries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有行程</h3>
            <p className="text-gray-600 mb-6">开始创建您的第一个旅行计划吧！</p>
            <button
              onClick={() => router.push('/plan')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建新行程
            </button>
          </div>
        ) : (
          <>
            {/* 行程网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {collection.itineraries.map((itinerary) => (
                <div key={itinerary.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* 行程头部 */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {itinerary.title}
                        </h3>
                        <p className="text-sm text-gray-600">📍 {itinerary.destination}</p>
                      </div>
                      {getStatusBadge(itinerary.status)}
                    </div>

                    {/* 行程信息 */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">📅 出发日期</span>
                        <span className="text-gray-900">{formatDate(itinerary.startDate)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">⏱️ 行程天数</span>
                        <span className="text-gray-900">{itinerary.totalDays}天</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">👥 人数</span>
                        <span className="text-gray-900">{itinerary.travelers}人</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">💰 预算</span>
                        <span className="text-gray-900 font-semibold">{formatCost(itinerary.totalBudget)}</span>
                      </div>
                    </div>

                    {/* 标签 */}
                    {itinerary.tags && itinerary.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {itinerary.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {itinerary.tags.length > 3 && (
                          <span className="text-gray-400 text-xs">+{itinerary.tags.length - 3}更多</span>
                        )}
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewItinerary(itinerary)}
                        className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        查看详情
                      </button>
                      <button
                        onClick={() => handleDuplicate(itinerary.id)}
                        className="bg-gray-100 text-gray-700 text-sm py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
                        title="复制行程"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleDelete(itinerary.id)}
                        className="bg-red-100 text-red-700 text-sm py-2 px-3 rounded-lg hover:bg-red-200 transition-colors"
                        title="删除行程"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页 */}
            {collection.total > collection.limit && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page! - 1) }))}
                  disabled={filters.page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="text-sm text-gray-700">
                  第 {filters.page} 页，共 {Math.ceil(collection.total / collection.limit)} 页
                </span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: (prev.page! + 1) }))}
                  disabled={filters.page! >= Math.ceil(collection.total / collection.limit)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}