'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ItineraryService } from '@/lib/itinerary-service';
import { TravelItinerary } from '@/types/ai';
import MapComponent, { MapPoint } from '@/components/MapComponent';
import NavigationPanel from '@/components/NavigationPanel';
import PointDetailModal from '@/components/PointDetailModal';

export default function ItineraryMapPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showRoutes, setShowRoutes] = useState(true);
  const [selectedNavPoint, setSelectedNavPoint] = useState<MapPoint | null>(null);
  const [selectedDetailPoint, setSelectedDetailPoint] = useState<MapPoint | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showPointDetail, setShowPointDetail] = useState(false);

  // 生成地图点位
  const generateMapPoints = async (itinerary: TravelItinerary) => {
    const points: MapPoint[] = [];
    
    itinerary.days.forEach((day) => {
      day.items.forEach((item, index) => {
        // 根据项目类型调整地图marker类型
        let mapType: MapPoint['type'];
        if (item.type === 'activity') {
          mapType = 'attraction'; // 将活动映射为景点
        } else {
          mapType = item.type as MapPoint['type'];
        }

        const point: MapPoint = {
          id: `day${day.day}-item${index}`,
          name: item.title, // 使用title作为name
          location: [
            item.coordinates?.lng || 116.404 + Math.random() * 0.1,
            item.coordinates?.lat || 39.915 + Math.random() * 0.1
          ],
          type: mapType,
          day: day.day,
          time: item.time,
          description: item.description,
          cost: item.cost,
          duration: item.duration
        };
        points.push(point);
      });
    });
    
    setMapPoints(points);
  };

  // 处理地图点击
  const handleMapPointClick = (point: MapPoint) => {
    setSelectedDetailPoint(point);
    setShowPointDetail(true);
  };

  // 处理导航
  const handleNavigateToPoint = (point: MapPoint) => {
    setSelectedNavPoint(point);
    setShowNavigation(true);
    setShowPointDetail(false);
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
                  {currentDayPoints.length} 个地点
                </div>
              </div>
              
              <MapComponent
                points={currentDayPoints}
                showRoutes={showRoutes}
                className="w-full h-[600px] rounded-lg"
                onPointClick={handleMapPointClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 地点详情弹窗 */}
      <PointDetailModal
        isOpen={showPointDetail}
        point={selectedDetailPoint}
        onClose={() => setShowPointDetail(false)}
        onNavigate={selectedDetailPoint ? () => handleNavigateToPoint(selectedDetailPoint) : undefined}
      />

      {/* 导航面板 */}
      <NavigationPanel
        isOpen={showNavigation}
        destination={selectedNavPoint}
        onClose={() => setShowNavigation(false)}
      />
    </div>
  );
}