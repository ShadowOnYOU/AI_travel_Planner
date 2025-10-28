'use client';

import { useState } from 'react';
import { MapPoint } from './MapComponent';

interface PointDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  point: MapPoint | null;
  onNavigate?: (point: MapPoint) => void;
  onEdit?: (point: MapPoint) => void;
}

export default function PointDetailModal({ 
  isOpen, 
  onClose, 
  point, 
  onNavigate,
  onEdit 
}: PointDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'reviews'>('info');

  if (!isOpen || !point) return null;

  const getTypeIcon = (type: string) => {
    const icons = {
      attraction: '🎯',
      hotel: '🏨',
      restaurant: '🍽️',
      transport: '🚇'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const getTypeName = (type: string) => {
    const names = {
      attraction: '景点',
      hotel: '住宿',
      restaurant: '餐厅',
      transport: '交通'
    };
    return names[type as keyof typeof names] || '地点';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getTypeIcon(point.type)}</span>
            <div>
              <h2 className="text-xl font-bold">{point.name}</h2>
              <span className="text-sm text-gray-600">{getTypeName(point.type)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'info' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 基本信息
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'photos' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📸 照片
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'reviews' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⭐ 评价
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* 基本信息 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">📍 位置信息</h3>
                <p className="text-sm text-gray-600">
                  经度: {point.location[0].toFixed(6)}
                </p>
                <p className="text-sm text-gray-600">
                  纬度: {point.location[1].toFixed(6)}
                </p>
              </div>

              {point.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">📝 详细介绍</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              )}

              {point.time && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">⏰ 推荐时间</h3>
                  <p className="text-sm text-gray-700">{point.time}</p>
                </div>
              )}

              {point.duration && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">⏱️ 建议游览时长</h3>
                  <p className="text-sm text-gray-700">
                    {Math.floor(point.duration / 60)} 小时 {point.duration % 60} 分钟
                  </p>
                </div>
              )}

              {point.cost && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">💰 预估费用</h3>
                  <p className="text-sm text-gray-700">
                    ¥{point.cost.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* 模拟照片 */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-3xl mb-2">🖼️</div>
                      <div className="text-sm">照片 {i}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 text-center">
                暂无照片，功能开发中
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* 模拟评价 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    A
                  </div>
                  <div>
                    <div className="font-medium text-sm">匿名用户</div>
                    <div className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  这个地方非常不错，值得一去！环境很好，服务也很贴心。
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                    B
                  </div>
                  <div>
                    <div className="font-medium text-sm">旅行爱好者</div>
                    <div className="text-yellow-500 text-sm">⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  位置很好找，交通便利。推荐给朋友们。
                </p>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                评价功能开发中，敬请期待
              </p>
            </div>
          )}
        </div>

        {/* 底部操作按钮 */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate(point)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              🧭 导航到这里
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={() => onEdit(point)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ✏️ 编辑
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}