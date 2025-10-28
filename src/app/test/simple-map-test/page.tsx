'use client';

import { useState, useEffect } from 'react';
import SimpleMapComponent, { MapPoint } from '@/components/SimpleMapComponent';

export default function SimpleMapTestPage() {
  const [testPoints, setTestPoints] = useState<MapPoint[]>([]);

  // 固定的测试数据 - 避免随机生成
  const mockPoints: MapPoint[] = [
    {
      id: '1',
      name: '天安门广场',
      location: [116.397428, 39.90923],
      type: 'attraction',
      description: '中华人民共和国的标志性建筑',
      time: '09:00',
      cost: 0,
      day: 1
    },
    {
      id: '2', 
      name: '故宫博物院',
      location: [116.397, 39.918],
      type: 'attraction',
      description: '世界文化遗产',
      time: '10:30',
      cost: 60,
      day: 1
    },
    {
      id: '3',
      name: '王府井大街',
      location: [116.407, 39.909],
      type: 'restaurant',
      description: '著名的购物和美食街',
      time: '15:00',
      cost: 150,
      day: 1
    }
  ];

  useEffect(() => {
    // 直接设置固定数据
    setTestPoints(mockPoints);
  }, []);

  const handlePointClick = (point: MapPoint) => {
    alert(`点击了: ${point.name}\n时间: ${point.time}\n费用: ¥${point.cost}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">简化地图测试</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 地图区域 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">地图显示</h2>
            <SimpleMapComponent
              center={[116.404, 39.915]}
              zoom={14}
              points={testPoints}
              className="w-full h-96 border rounded"
              onPointClick={handlePointClick}
            />
          </div>

          {/* 信息面板 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">地点列表</h2>
            <div className="space-y-3">
              {testPoints.map((point) => (
                <div key={point.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="font-medium">{point.name}</div>
                  <div className="text-sm text-gray-600">{point.time}</div>
                  <div className="text-sm text-blue-600">¥{point.cost}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ 简化说明</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• 去掉了复杂的坐标验证和延迟逻辑</li>
            <li>• 使用固定的测试数据，避免随机生成</li>
            <li>• 简化了错误处理和调试日志</li>
            <li>• 减少了不必要的 useEffect 依赖</li>
            <li>• 使用基础的高德地图API，避免复杂功能</li>
          </ul>
        </div>
      </div>
    </div>
  );
}