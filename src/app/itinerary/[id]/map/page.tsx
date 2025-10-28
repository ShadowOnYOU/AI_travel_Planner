'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ItineraryService } from '@/lib/itinerary-service';
import { TravelItinerary } from '@/types/ai';
import SimpleMapComponent from '@/components/SimpleMapComponent';
import { MapPoint } from '@/types/travel';

export default function ItineraryMapPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [selectedDay, setSelectedDay] = useState(0); // 0 表示显示所有天
  const [showRoutes, setShowRoutes] = useState(true);

  // 生成地图点位
  const generateMapPoints = async (itinerary: TravelItinerary) => {
    const points: MapPoint[] = [];
    
    // 动态导入地理编码工具
    const { getCenterCoordinates, generateRealisticCoordinates } = await import('@/utils/geocoding');
    
    // 获取目的地的中心坐标
    const baseCoords = getCenterCoordinates(itinerary.destination);
    
    console.log('🗺️ [MapPage] 目的地:', itinerary.destination, '中心坐标:', baseCoords);
    
    itinerary.days.forEach((day) => {
      day.items.forEach((item, index) => {
        // 根据项目类型调整地图marker类型
        let mapType: MapPoint['type'];
        if (item.type === 'activity') {
          mapType = 'attraction'; // 将活动映射为景点
        } else {
          mapType = item.type as MapPoint['type'];
        }

        // 生成真实的坐标
        let coordinates: [number, number];
        
        if (item.coordinates?.lng && item.coordinates?.lat) {
          // 如果已有坐标，直接使用
          coordinates = [item.coordinates.lng, item.coordinates.lat];
        } else {
          // 使用地理编码工具生成真实坐标
          coordinates = generateRealisticCoordinates(item.title, itinerary.destination, baseCoords);
        }

        const point: MapPoint = {
          id: `day${day.day}-item${index}`,
          name: item.title, // 使用title作为name
          coordinates: coordinates,
          type: mapType,
          day: day.day,
          description: item.description
        };
        
        console.log('📍 [MapPage] 生成地点:', {
          name: point.name,
          coordinates: point.coordinates,
          type: point.type,
          day: point.day
        });
        
        points.push(point);
      });
    });
    
    console.log('🎯 [MapPage] 生成地图点位完成:', points.length, '个地点');
    setMapPoints(points);
  };



  // 加载行程数据
  useEffect(() => {
    const loadItinerary = async () => {
      try {
        const id = params?.id as string;
        if (id) {
          const data = await ItineraryService.getItineraryById(id, user?.id);
          if (data) {
            setItinerary(data);
            await generateMapPoints(data);
          } else {
            router.push('/itinerary');
            return;
          }
        } else {
          router.push('/itinerary');
          return;
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

  // 筛选当前天的地点
  const currentDayPoints = mapPoints.filter(point => 
    selectedDay === 0 || point.day === selectedDay
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在加载地图...</p>
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
                onClick={() => router.push(`/itinerary/${params.id}`)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                返回行程详情
              </button>
              <span className="text-gray-600">
                欢迎，{user?.email}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📍 {itinerary.title} - 行程地图
          </h1>
          <p className="text-gray-600">
            {itinerary.destination} • {itinerary.totalDays}天行程地图导航
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 日期筛选 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">选择天数</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedDay(0)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDay === 0
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  全部天数 ({mapPoints.length}个地点)
                </button>
                {itinerary.days.map((day) => {
                  const dayPoints = mapPoints.filter(p => p.day === day.day);
                  return (
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
                        {dayPoints.length}个地点
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 地图选项 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">地图选项</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showRoutes}
                    onChange={(e) => setShowRoutes(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-gray-700">显示路线</span>
                </label>
              </div>
            </div>

            {/* 图例 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">地点类型</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span className="text-gray-600">景点</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏨</span>
                  <span className="text-gray-600">住宿</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🍽️</span>
                  <span className="text-gray-600">餐厅</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🚇</span>
                  <span className="text-gray-600">交通</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎪</span>
                  <span className="text-gray-600">活动</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧地图区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedDay === 0 ? '全部地点' : `第${selectedDay}天地点`}
                </h2>
                <div className="text-sm text-gray-600">
                  {selectedDay === 0 ? mapPoints.length : mapPoints.filter(p => p.day === selectedDay).length} 个地点
                </div>
              </div>
              
              <SimpleMapComponent points={selectedDay === 0 ? mapPoints : mapPoints.filter(p => p.day === selectedDay)} />
            </div>

            {/* 路线时间轴 */}
            {itinerary && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📅 {selectedDay === 0 ? '完整行程路线' : `第${selectedDay}天路线`}
                </h3>
                
                {selectedDay === 0 ? (
                  // 显示所有天的路线
                  <div className="space-y-6">
                    {itinerary.days.map((day) => (
                      <div key={day.day} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          第{day.day}天 - {day.date}
                        </h4>
                        <div className="space-y-3">
                          {day.items.map((item, index) => (
                            <div key={item.id} className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-800">{item.title}</span>
                                  <span className="text-sm text-gray-500">
                                    {item.time}
                                  </span>
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                    {item.type === 'attraction' ? '🎯 景点' : 
                                     item.type === 'restaurant' ? '🍽️ 餐厅' :
                                     item.type === 'hotel' ? '🏨 住宿' :
                                     item.type === 'transport' ? '🚇 交通' : '🎪 活动'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                {item.location && (
                                  <p className="text-xs text-gray-500">📍 {item.location}</p>
                                )}
                                {item.cost && (
                                  <p className="text-xs text-green-600 mt-1">💰 ¥{item.cost}</p>
                                )}
                              </div>
                              {index < day.items.length - 1 && (
                                <div className="flex-shrink-0 text-gray-400 text-sm ml-4">
                                  ↓
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // 显示特定天的路线
                  <div className="space-y-3">
                    {itinerary.days
                      .find(d => d.day === selectedDay)?.items
                      .map((item, index, array) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-800 text-lg">{item.title}</span>
                              <span className="text-blue-600 font-medium">
                                {item.time}
                              </span>
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                {item.type === 'attraction' ? '🎯 景点' : 
                                 item.type === 'restaurant' ? '🍽️ 餐厅' :
                                 item.type === 'hotel' ? '🏨 住宿' :
                                 item.type === 'transport' ? '🚇 交通' : '🎪 活动'}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {item.location && (
                                <span>📍 {item.location}</span>
                              )}
                              {item.duration && (
                                <span>⏱️ {item.duration}分钟</span>
                              )}
                              {item.cost && (
                                <span className="text-green-600">💰 ¥{item.cost}</span>
                              )}
                            </div>
                            {item.notes && (
                              <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                                💡 {item.notes}
                              </div>
                            )}
                          </div>
                          {index < array.length - 1 && (
                            <div className="flex flex-col items-center mt-4">
                              <div className="w-px h-6 bg-gray-300"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <div className="w-px h-6 bg-gray-300"></div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}