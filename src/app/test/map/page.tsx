'use client';

import { useState } from 'react';
import MapComponent, { MapPoint } from '@/components/MapComponent';
import MapConfig from '@/components/MapConfig';

export default function MapTestPage() {
  const [showConfig, setShowConfig] = useState(false);

  // 测试数据点
  const testPoints: MapPoint[] = [
    {
      id: '1',
      name: '天安门广场',
      location: [116.397428, 39.90923],
      type: 'attraction',
      description: '中华人民共和国的标志性建筑',
      time: '09:00',
      cost: 0,
      duration: 60,
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
      duration: 180,
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
      duration: 120,
      day: 1
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">地图测试页面</h1>
        
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setShowConfig(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            配置地图API Key
          </button>
          <div className="text-sm text-gray-600 py-2">
            当前环境API Key: {process.env.NEXT_PUBLIC_AMAP_KEY ? '已配置' : '未配置'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">地图组件测试</h2>
          <div className="h-96 border rounded">
            <MapComponent
              center={[116.397428, 39.90923]}
              zoom={14}
              points={testPoints}
              showRoutes={true}
              className="w-full h-full"
              onPointClick={(point) => {
                console.log('点击了地点:', point);
                alert(`点击了: ${point.name}`);
              }}
            />
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">测试数据</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testPoints.map((point) => (
              <div key={point.id} className="p-3 border rounded">
                <h3 className="font-semibold">{point.name}</h3>
                <p className="text-sm text-gray-600">{point.description}</p>
                <p className="text-sm">坐标: [{point.location[0]}, {point.location[1]}]</p>
                <p className="text-sm">类型: {point.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MapConfig 
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
      />
    </div>
  );
}