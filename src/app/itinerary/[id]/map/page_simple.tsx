'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ItineraryService } from '@/lib/itinerary-service';
import { TravelItinerary } from '@/types/ai';
import SimpleMapComponent from '@/components/SimpleMapComponent';
import { MapPoint } from '@/types/travel';
import Link from 'next/link';

export default function SimpleItineraryMapPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(0); // 0 表示显示所有天
  const [error, setError] = useState<string | null>(null);

  // 获取坐标的辅助函数
  const getCoordinatesForLocation = (locationName: string): [number, number] | null => {
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
      '广州': [113.2644, 23.1291],
      '深圳': [114.0579, 22.5431],
      '成都': [104.0668, 30.5728],
      '武汉': [114.3054, 30.5931],
      '西安': [108.9402, 34.3416],
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
  };

  // 生成地图点位
  const generateMapPoints = (itinerary: TravelItinerary): MapPoint[] => {
    const points: MapPoint[] = [];
    
    if (itinerary.days) {
      itinerary.days.forEach((day: any, dayIndex: number) => {
        if (day.activities) {
          day.activities.forEach((activity: any, activityIndex: number) => {
            const coordinates = getCoordinatesForLocation(
              activity.location || activity.name || activity.place
            );
            
            if (coordinates) {
              points.push({
                id: `day${dayIndex + 1}_activity${activityIndex + 1}`,
                name: activity.name || activity.location || activity.place || `活动${activityIndex + 1}`,
                coordinates,
                type: 'attraction',
                description: `第${dayIndex + 1}天 - ${activity.description || activity.name}`,
                address: activity.location || activity.address
              });
            }
          });
        }
      });
    }
    
    return points;
  };

  // 加载行程数据
  useEffect(() => {
    const loadItinerary = async () => {
      if (!user) {
        router.push('/auth/signin');
        return;
      }
      
      const id = params.id as string;
      if (!id) {
        setError('行程ID无效');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await ItineraryService.getItineraryById(id);
        
        if (data) {
          setItinerary(data);
          const points = generateMapPoints(data);
          setMapPoints(points);
          
          if (points.length === 0) {
            setError('未能解析出有效的地点坐标，可能是地点名称不在支持范围内');
          }
        } else {
          setError('未找到行程数据');
        }
      } catch (err) {
        console.error('加载行程失败:', err);
        setError('加载行程数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadItinerary();
  }, [params.id, user, router]);

  // 获取当前显示的地点
  const getDisplayedPoints = () => {
    if (selectedDay === 0) return mapPoints;
    
    // 根据地点名称中的天数信息进行过滤
    return mapPoints.filter(point => 
      point.description?.includes(`第${selectedDay}天`)
    );
  };

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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h3 className="font-semibold mb-2">加载失败</h3>
            <p>{error}</p>
          </div>
          <Link 
            href="/itinerary"
            className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            返回行程列表
          </Link>
        </div>
      </div>
    );
  }

  const displayedPoints = getDisplayedPoints();
  const totalDays = itinerary?.days?.length || 0;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面头部 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {itinerary?.destination || '行程地图'}
              </h1>
              <p className="text-gray-600 mt-1">
                {itinerary?.startDate} - {itinerary?.endDate}
              </p>
            </div>
            <Link 
              href="/itinerary"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              返回列表
            </Link>
          </div>

          {/* 天数选择器 */}
          {totalDays > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDay(0)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedDay === 0 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                全部
              </button>
              {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    selectedDay === day 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  第{day}天
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 地图区域 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">地图视图</h2>
            <p className="text-sm text-gray-600">
              {selectedDay === 0 ? '显示全部' : `第${selectedDay}天`} - 
              共 {displayedPoints.length} 个地点
            </p>
          </div>

          <div className="h-96 w-full">
            <SimpleMapComponent points={displayedPoints} />
          </div>
        </div>

        {/* 地点列表 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            地点列表 ({displayedPoints.length})
          </h3>
          
          {displayedPoints.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {selectedDay === 0 ? '没有找到有效的地点坐标' : `第${selectedDay}天没有地点信息`}
              </p>
              {mapPoints.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  建议检查地点名称是否为常见城市或景点
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedPoints.map((point, index) => (
                <div key={point.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{point.name}</h4>
                      {point.description && (
                        <p className="text-sm text-gray-600 mb-2">{point.description}</p>
                      )}
                      {point.address && (
                        <p className="text-xs text-gray-500 mb-1">{point.address}</p>
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
          )}
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 text-center space-x-4">
          <Link 
            href={`/itinerary/${params.id}`}
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            查看行程详情
          </Link>
          <Link 
            href={`/itinerary/${params.id}/edit`}
            className="inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            编辑行程
          </Link>
        </div>
      </div>
    </div>
  );
}