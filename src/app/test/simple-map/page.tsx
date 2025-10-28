'use client';

import { useEffect, useRef, useState } from 'react';

export default function SimpleMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [log, setLog] = useState<string[]>([]);
  const [map, setMap] = useState<any>(null);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const initSimpleMap = async () => {
    try {
      addLog('🚀 开始初始化最简单的地图...');
      
      if (!mapRef.current) {
        addLog('❌ 地图容器未找到');
        return;
      }

      // 检查环境变量
      const apiKey = process.env.NEXT_PUBLIC_AMAP_KEY || '1e967f9e5d863f52e8e76a8b7c381669';
      addLog(`🔑 API Key: ${apiKey.substring(0, 8)}...`);

      // 动态导入AMapLoader
      const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
      addLog('✅ AMapLoader 导入成功');

      // 加载高德地图
      const AMap = await AMapLoader.load({
        key: apiKey,
        version: '2.0',
        plugins: [],
      });
      addLog('✅ 高德地图 SDK 加载成功');

      // 创建最简单的地图
      const mapInstance = new AMap.Map(mapRef.current, {
        zoom: 10,
        center: [116.397428, 39.90923], // 天安门坐标
        mapStyle: 'amap://styles/normal',
      });
      
      addLog('✅ 地图实例创建成功');

      // 等待地图加载完成
      mapInstance.on('complete', () => {
        addLog('🎯 地图加载完成事件触发');
        setMap(mapInstance);
        
        // 现在尝试添加一个最简单的标记
        try {
          const marker = new AMap.Marker({
            position: [116.397428, 39.90923],
            title: '天安门广场'
          });
          
          mapInstance.add(marker);
          addLog('✅ 标记添加成功');
          
        } catch (error) {
          addLog(`❌ 标记添加失败: ${error}`);
        }
      });

    } catch (error) {
      addLog(`❌ 地图初始化失败: ${error}`);
      console.error('地图初始化失败:', error);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      initSimpleMap();
    }
  }, []);

  const testAddMarker = () => {
    if (!map) {
      addLog('❌ 地图未初始化');
      return;
    }

    try {
      // 测试添加不同的标记
      const testCoords = [
        { name: '故宫博物院', coords: [116.397, 39.918] },
        { name: '王府井大街', coords: [116.407, 39.909] },
        { name: '北海公园', coords: [116.389, 39.928] }
      ];

      testCoords.forEach((item, index) => {
        try {
          const marker = new (window as any).AMap.Marker({
            position: item.coords,
            title: item.name,
            content: `<div style="color: red;">${item.name}</div>`
          });
          
          map.add(marker);
          addLog(`✅ ${item.name} 标记添加成功`);
        } catch (error) {
          addLog(`❌ ${item.name} 标记添加失败: ${error}`);
        }
      });

    } catch (error) {
      addLog(`❌ 批量添加标记失败: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">简单地图测试</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 地图区域 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">地图显示</h2>
            <div ref={mapRef} className="w-full h-96 border rounded" />
            
            <div className="mt-4 space-x-2">
              <button
                onClick={testAddMarker}
                disabled={!map}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
              >
                测试添加标记
              </button>
              <button
                onClick={() => initSimpleMap()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                重新初始化
              </button>
            </div>
          </div>

          {/* 日志区域 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">执行日志</h2>
            <div className="h-96 overflow-y-auto bg-gray-50 p-3 rounded text-sm font-mono">
              {log.map((item, index) => (
                <div key={index} className="mb-1">
                  {item}
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setLog([])}
              className="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              清空日志
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">测试说明</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 这是最简化的地图测试，使用最基本的配置</li>
            <li>• 固定使用天安门广场坐标: [116.397428, 39.90923]</li>
            <li>• 如果这个页面出错，说明地图基础配置有问题</li>
            <li>• 如果正常，可以逐步测试更复杂的功能</li>
          </ul>
        </div>
      </div>
    </div>
  );
}