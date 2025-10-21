'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TravelItinerary } from '@/types/ai';
import { ItineraryService } from '@/lib/itinerary-service';
import { useAuth } from '@/contexts/AuthContext';

export default function EditItineraryPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 表单状态
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [totalBudget, setTotalBudget] = useState(0);
  const [travelers, setTravelers] = useState(1);
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<TravelItinerary['status']>('draft');

  // 加载行程数据
  useEffect(() => {
    const loadItinerary = async () => {
      try {
        const id = params?.id as string;
        if (id) {
          const data = await ItineraryService.getItineraryById(id, user?.id);
          if (data) {
            setItinerary(data);
            setTitle(data.title);
            setDestination(data.destination);
            setTotalBudget(data.totalBudget);
            setTravelers(data.travelers);
            setSummary(data.summary);
            setTags(data.tags || []);
            setStatus(data.status);
          } else {
            router.push('/itinerary');
          }
        }
      } catch (error) {
        console.error('加载行程失败:', error);
        router.push('/itinerary');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadItinerary();
    } else {
      router.push('/auth/signin');
    }
  }, [user, router, params]);

  // 保存修改
  const handleSave = async () => {
    if (!itinerary) return;

    try {
      setSaving(true);
      const updatedItinerary: TravelItinerary = {
        ...itinerary,
        title,
        destination,
        totalBudget,
        travelers,
        summary,
        tags,
        status,
      };

      await ItineraryService.saveItinerary(updatedItinerary, user?.id);
      alert('行程已保存！');
      router.push(`/itinerary/${itinerary.id}`);
    } catch (error) {
      console.error('保存行程失败:', error);
      alert('保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  // 添加标签
  const addTag = () => {
    const newTag = prompt('输入新标签:');
    if (newTag && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">行程不存在</h2>
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
                onClick={() => router.push(`/itinerary/${itinerary.id}`)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">编辑行程</h1>

          <div className="space-y-6">
            {/* 行程标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                行程标题 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入行程标题"
              />
            </div>

            {/* 目的地 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目的地 *
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入目的地"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 总预算 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  总预算 (¥)
                </label>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              {/* 人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出行人数
                </label>
                <input
                  type="number"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            {/* 行程状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                行程状态
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TravelItinerary['status'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">草稿</option>
                <option value="confirmed">已确认</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>

            {/* 行程概述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                行程概述
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="描述您的行程..."
              />
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={addTag}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + 添加标签
              </button>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              onClick={() => router.push(`/itinerary/${itinerary.id}`)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !destination.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : '保存修改'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}