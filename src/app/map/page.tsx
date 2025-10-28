'use client';

import { useState, useEffect } from 'react';
import SimpleMapComponent from '@/components/SimpleMapComponent';
import type { MapPoint } from '@/types/travel';
import Link from 'next/link';

export default function SimplifiedItineraryPage() {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从localStorage或API获取行程数据
  useEffect(() => {
    const loadItineraryData = async () => {
      try {
        // 尝试从localStorage获取最新的行程数据
        const savedItinerary = localStorage.getItem('latest_itinerary');
        
        if (savedItinerary) {
          const itineraryData = JSON.parse(savedItinerary);
          
          // 将行程数据转换为地图点
          const points: MapPoint[] = [];
          
          if (itineraryData.days) {
            itineraryData.days.forEach((day: any, dayIndex: number) => {
              if (day.activities) {
                day.activities.forEach((activity: any, activityIndex: number) => {
                  // 尝试从活动名称生成坐标
                  const coordinates = getCoordinatesForLocation(activity.location || activity.name);
                  
                  if (coordinates) {
                    points.push({
                      id: `day${dayIndex + 1}_activity${activityIndex + 1}`,
                      name: activity.name || activity.location,
                      coordinates,
                      type: 'attraction',
                      description: activity.description || `第${dayIndex + 1}天活动`
                    });
                  }
                });
              }
            });
          }
          
          if (points.length > 0) {
            setMapPoints(points);
          } else {
            // 如果没有有效坐标，使用默认数据
            setMapPoints(getDefaultMapPoints());
          }
        } else {
          // 没有保存的行程，使用默认数据
          setMapPoints(getDefaultMapPoints());
        }
        
        setLoading(false);
      } catch (err) {
        console.error('加载行程数据失败:', err);
        setError('加载行程数据失败，使用默认数据');
        setMapPoints(getDefaultMapPoints());
        setLoading(false);
      }
    };

    loadItineraryData();
  }, []);

  // 获取位置对应的坐标
  function getCoordinatesForLocation(locationName: string): [number, number] | null {
    const coordinateMap: Record<string, [number, number]> = {
      '北京': [116.4074, 39.9042],
      '天安门': [116.3977, 39.9071],
      '故宫': [116.3974, 39.9170],
      '颐和园': [116.2735, 39.9996],
      '天坛': [116.4074, 39.8822],
      '长城': [116.5704, 40.4319],
      '鸟巢': [116.3883, 39.9925],
      '水立方': [116.3894, 39.9934],
      '上海': [121.4737, 31.2304],
      '外滩': [121.4899, 31.2397],
      '东方明珠': [121.4995, 31.2394],
      '南京路': [121.4759, 31.2336],
      '城隍庙': [121.4925, 31.2263],
      '杭州': [120.1551, 30.2741],
      '西湖': [120.1445, 30.2592],
      '灵隐寺': [120.1014, 30.2424],
      '雷峰塔': [120.1488, 30.2316],
    };

    // 精确匹配
    if (coordinateMap[locationName]) {
      return coordinateMap[locationName];
    }

    // 模糊匹配
    for (const [key, coords] of Object.entries(coordinateMap)) {
      if (locationName.includes(key) || key.includes(locationName)) {
        return coords;
      }
    }

    return null;
  }

  // 获取默认地图点数据
  function getDefaultMapPoints(): MapPoint[] {
    return [
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
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">加载行程地图中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">行程地图</h1>
              <p className="text-gray-600">
                查看您的旅行路线和景点分布
              </p>
            </div>
            <Link 
              href="/dashboard"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              返回主页
            </Link>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">地图视图</h2>
            <p className="text-sm text-gray-600">
              共 {mapPoints.length} 个地点
            </p>
          </div>

          <div className="h-96 w-full mb-6">
            <SimpleMapComponent points={mapPoints} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">地点列表</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mapPoints.map((point, index) => (
                <div key={point.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{point.name}</h4>
                      {point.description && (
                        <p className="text-sm text-gray-600 mb-2">{point.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        坐标: {point.coordinates[0].toFixed(4)}, {point.coordinates[1].toFixed(4)}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm ml-2">
                      {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/plan/new"
            className="inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mr-4"
          >
            规划新行程
          </Link>
          <Link 
            href="/itinerary"
            className="inline-block px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            查看行程详情
          </Link>
        </div>
      </div>
    </div>
  );
}