'use client';

import { useState, useEffect } from 'react';
import { TravelItinerary } from '@/types/ai';
import MapComponent, { MapPoint } from '@/components/MapComponent';

export default function MapDebugPage() {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [testPoints, setTestPoints] = useState<MapPoint[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 模拟行程数据 - 使用固定时间戳避免SSR水合错误
  const mockItinerary: TravelItinerary = {
    id: 'debug-test',
    title: '北京三日游',
    destination: '北京',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    totalDays: 3,
    totalBudget: 3000,
    actualCost: 210,
    travelers: 2,
    travelStyle: '文化历史',
    summary: '探索北京的历史文化和现代魅力',
    recommendations: ['建议提前预约故宫门票', '注意保暖'],
    days: [
      {
        day: 1,
        date: '2024-01-15',
        totalCost: 210,
        summary: '北京经典景点游览',
        items: [
          {
            id: 'item-1',
            title: '天安门广场',
            type: 'attraction',
            time: '09:00',
            duration: 60,
            description: '参观天安门广场，感受历史文化',
            cost: 0,
            day: 1,
            location: '天安门广场'
          },
          {
            id: 'item-2',
            title: '故宫博物院',
            type: 'attraction',
            time: '10:30',
            duration: 180,
            description: '游览故宫，欣赏古代建筑',
            cost: 60,
            day: 1,
            location: '故宫博物院'
          },
          {
            id: 'item-3',
            title: '王府井大街',
            type: 'restaurant',
            time: '15:00',
            duration: 120,
            description: '王府井美食街用餐购物',
            cost: 150,
            day: 1,
            location: '王府井大街'
          }
        ]
      }
    ],
    createdAt: '2024-01-15T00:00:00.000Z', // 固定时间戳
    updatedAt: '2024-01-15T00:00:00.000Z', // 固定时间戳
    userId: 'debug-user'
  };

  // 生成测试地图点位
  const generateTestPoints = async () => {
    try {
      const log = ['🔧 开始调试地图点位生成...'];
      
      // 动态导入地理编码工具
      const { getCenterCoordinates, generateRealisticCoordinates } = await import('@/utils/geocoding');
      log.push(`✅ 地理编码工具导入成功`);
      
      // 获取北京中心坐标
      const baseCoords = getCenterCoordinates(mockItinerary.destination);
      log.push(`📍 ${mockItinerary.destination} 中心坐标: [${baseCoords[0]}, ${baseCoords[1]}]`);
      
      const points: MapPoint[] = [];
      
      mockItinerary.days.forEach((day) => {
        day.items.forEach((item, index) => {
          // 生成真实坐标
          const coordinates = generateRealisticCoordinates(item.title, mockItinerary.destination, baseCoords);
          
          const point: MapPoint = {
            id: `day${day.day}-item${index}`,
            name: item.title,
            location: coordinates,
            type: item.type as MapPoint['type'],
            day: day.day,
            time: item.time,
            description: item.description,
            cost: item.cost,
            duration: item.duration
          };
          
          points.push(point);
          log.push(`📌 生成点位: ${point.name} - [${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}]`);
        });
      });
      
      log.push(`🎯 总计生成 ${points.length} 个地图点位`);
      setTestPoints(points);
      setDebugInfo(log.join('\\n'));
      
    } catch (error) {
      console.error('调试生成失败:', error);
      setDebugInfo(`❌ 调试失败: ${error}`);
    }
  };

  useEffect(() => {
    setIsClient(true);
    generateTestPoints();
  }, []);

  const handlePointClick = (point: MapPoint) => {
    alert(`点击了: ${point.name}\\n坐标: [${point.location[0]}, ${point.location[1]}]\\n类型: ${point.type}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">地图调试页面</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 地图区域 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">地图显示</h2>
            <div className="h-96 border rounded">
              <MapComponent
                center={[116.404, 39.915]}
                zoom={12}
                points={testPoints}
                showRoutes={true}
                className="w-full h-full"
                onPointClick={handlePointClick}
              />
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={generateTestPoints}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                重新生成点位
              </button>
              <div className="text-sm text-gray-600 py-2">
                环境API Key: {process.env.NEXT_PUBLIC_AMAP_KEY ? '已配置' : '未配置'}
              </div>
            </div>
          </div>

          {/* 调试信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">调试信息</h2>
            <div className="h-96 overflow-y-auto">
              <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap">
                {debugInfo}
              </pre>
            </div>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">生成的点位</h3>
            <div className="max-h-40 overflow-y-auto">
              {testPoints.map((point, index) => (
                <div key={point.id} className="text-sm p-2 border-b">
                  <div className="font-medium">{point.name}</div>
                  <div className="text-gray-600">
                    坐标: [{point.location[0].toFixed(6)}, {point.location[1].toFixed(6)}]
                  </div>
                  <div className="text-gray-500">
                    类型: {point.type} | 第{point.day}天 | {point.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 原始数据 - 只在客户端显示避免SSR问题 */}
        {isClient && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">原始行程数据</h2>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
              {JSON.stringify(mockItinerary, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}