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
      draft: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
      confirmed: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
      completed: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
      cancelled: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
    };
    const labels = {
      draft: '✏️ 草稿',
      confirmed: '✅ 已确认',
      completed: '🎉 已完成',
      cancelled: '❌ 已取消'
    };
    return (
      <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${styles[actualStatus]}`}>
        {labels[actualStatus]}
      </span>
    );
  };

  if (loading && collection.itineraries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">正在加载行程列表...</p>
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
              <button
                onClick={() => router.push('/plan')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                ✨ 新建行程
              </button>
              {user?.email && (
                <span className="text-sm text-gray-600 hidden sm:inline">
                  欢迎，{user.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8 relative">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
                我的行程
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                管理您的所有旅行计划 ✨
              </p>
            </div>

          </div>
        </div>        {/* 搜索和筛选 */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 搜索行程标题、目的地..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-gray-300"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
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
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-gray-300"
              >
                <option value="">📋 所有状态</option>
                <option value="draft">✏️ 草稿</option>
                <option value="confirmed">✅ 已确认</option>
                <option value="completed">🎉 已完成</option>
                <option value="cancelled">❌ 已取消</option>
              </select>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                🔍 搜索
              </button>
              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                🔄 重置
              </button>
            </div>
          </div>
        </div>

        {/* 行程列表 */}
        {collection.itineraries.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-16 text-center">
            <div className="text-8xl mb-6">✈️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">还没有行程</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">开始创建您的第一个旅行计划吧！让AI为您规划完美的旅程 ✨</p>
            <button
              onClick={() => router.push('/plan')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              🚀 创建新行程
            </button>
          </div>
        ) : (
          <>
            {/* 行程网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {collection.itineraries.map((itinerary) => (
                <div key={itinerary.id} className="group relative bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-6">
                    {/* 行程头部 */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                          {itinerary.title}
                        </h3>
                        <p className="text-gray-600 flex items-center">
                          <span className="text-lg mr-2">📍</span>
                          {itinerary.destination}
                        </p>
                      </div>
                      <div className="ml-3">
                        {getStatusBadge(itinerary.status)}
                      </div>
                    </div>

                    {/* 行程信息 */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm bg-gray-50/50 rounded-lg p-3">
                        <span className="text-gray-600 flex items-center">
                          <span className="text-base mr-2">📅</span>
                          出发日期
                        </span>
                        <span className="text-gray-900 font-medium">{formatDate(itinerary.startDate)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm bg-gray-50/50 rounded-lg p-3">
                        <span className="text-gray-600 flex items-center">
                          <span className="text-base mr-2">⏱️</span>
                          行程天数
                        </span>
                        <span className="text-gray-900 font-medium">{itinerary.totalDays}天</span>
                      </div>
                      <div className="flex items-center justify-between text-sm bg-gray-50/50 rounded-lg p-3">
                        <span className="text-gray-600 flex items-center">
                          <span className="text-base mr-2">👥</span>
                          人数
                        </span>
                        <span className="text-gray-900 font-medium">{itinerary.travelers}人</span>
                      </div>
                      <div className="flex items-center justify-between text-sm bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                        <span className="text-green-700 flex items-center font-medium">
                          <span className="text-base mr-2">💰</span>
                          预算
                        </span>
                        <span className="text-green-800 font-bold text-lg">{formatCost(itinerary.totalBudget)}</span>
                      </div>
                    </div>

                    {/* 标签 */}
                    {itinerary.tags && itinerary.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {itinerary.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
                            {tag}
                          </span>
                        ))}
                        {itinerary.tags.length > 3 && (
                          <span className="text-gray-500 text-xs font-medium bg-gray-100 px-3 py-1 rounded-full">
                            +{itinerary.tags.length - 3}更多
                          </span>
                        )}
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => viewItinerary(itinerary)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                      >
                        👁️ 查看详情
                      </button>
                      <button
                        onClick={() => handleDuplicate(itinerary.id)}
                        className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg border border-green-200"
                        title="复制行程"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleDelete(itinerary.id)}
                        className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 hover:from-red-200 hover:to-pink-200 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg border border-red-200"
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
              <div className="flex justify-center items-center space-x-6">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page! - 1) }))}
                  disabled={filters.page === 1}
                  className="px-6 py-3 font-medium text-gray-600 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-xl hover:bg-white hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  ← 上一页
                </button>
                <div className="bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl border-2 border-gray-200 shadow-md">
                  <span className="text-gray-700 font-medium">
                    第 {filters.page} 页，共 {Math.ceil(collection.total / collection.limit)} 页
                  </span>
                </div>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: (prev.page! + 1) }))}
                  disabled={filters.page! >= Math.ceil(collection.total / collection.limit)}
                  className="px-6 py-3 font-medium text-gray-600 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-xl hover:bg-white hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  下一页 →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}