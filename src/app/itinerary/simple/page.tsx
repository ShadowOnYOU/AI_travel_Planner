'use client';

import { useState, useEffect } from 'react';
import SimpleMapComponent from '@/components/SimpleMapComponent';
import type { MapPoint } from '@/types/travel';

const mockItineraryData: MapPoint[] = [
  {
    id: '1',
    name: '天安门广场',
    coordinates: [116.3977, 39.9071],
    type: 'attraction',
    description: '北京的象征性广场'
  },
  {
    id: '2', 
    name: '故宫博物院',
    coordinates: [116.3974, 39.9170],
    type: 'attraction',
    description: '明清两朝的皇宫'
  },
  {
    id: '3',
    name: '颐和园',
    coordinates: [116.2735, 39.9996],
    type: 'attraction',
    description: '清朝的皇家园林'
  },
  {
    id: '4',
    name: '天坛',
    coordinates: [116.4074, 39.8822],
    type: 'attraction',
    description: '明清皇帝祭天的场所'
  }
];

export default function SimpleItineraryPage() {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setMapPoints(mockItineraryData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">加载行程数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">简化版行程地图</h1>
          <p className="text-gray-600">
            这是一个简化版本的行程地图显示，没有复杂的验证和错误处理逻辑。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">北京经典景点</h2>
            <p className="text-sm text-gray-600">
              共 {mapPoints.length} 个景点
            </p>
          </div>

          <div className="h-96 w-full">
            <SimpleMapComponent points={mapPoints} />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">景点列表</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mapPoints.map((point, index) => (
                <div key={point.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{point.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{point.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        坐标: {point.coordinates[0]}, {point.coordinates[1]}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}