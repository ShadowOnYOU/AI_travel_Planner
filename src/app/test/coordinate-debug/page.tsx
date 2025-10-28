'use client';

import { useState, useEffect } from 'react';

export default function CoordinateDebugPage() {
  const [debugResults, setDebugResults] = useState<string>('');

  const testCoordinateGeneration = async () => {
    const log: string[] = [];
    
    try {
      log.push('🔧 开始坐标生成调试...');
      
      // 动态导入地理编码工具
      const { getCenterCoordinates, generateRealisticCoordinates, getCoordinatesByName, CITY_COORDINATES, ATTRACTION_COORDINATES } = await import('@/utils/geocoding');
      
      log.push('✅ 地理编码工具导入成功');
      
      // 测试城市坐标数据
      log.push('\n📍 测试城市坐标数据:');
      const testCities = ['北京', '上海', '杭州', '成都'];
      testCities.forEach(city => {
        const coords = getCenterCoordinates(city);
        log.push(`${city}: [${coords[0]}, ${coords[1]}]`);
      });
      
      // 测试景点坐标数据
      log.push('\n🎯 测试景点坐标数据:');
      const testAttractions = ['天安门广场', '故宫博物院', '王府井大街'];
      testAttractions.forEach(attraction => {
        const result = getCoordinatesByName(attraction);
        if (result) {
          log.push(`${attraction}: [${result.lng}, ${result.lat}]`);
        } else {
          log.push(`${attraction}: 未找到坐标`);
        }
      });
      
      // 测试坐标生成函数
      log.push('\n🔧 测试坐标生成函数:');
      const testItems = [
        { title: '天安门广场', destination: '北京' },
        { title: '故宫博物院', destination: '北京' },
        { title: '王府井大街', destination: '北京' },
        { title: '随机景点', destination: '北京' },
        { title: '上海外滩', destination: '上海' },
        { title: '随机地点', destination: '杭州' }
      ];
      
      testItems.forEach(item => {
        const coords = generateRealisticCoordinates(item.title, item.destination);
        log.push(`${item.title} (${item.destination}): [${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}]`);
        
        // 验证坐标有效性
        const [lng, lat] = coords;
        const isValid = !isNaN(lng) && !isNaN(lat) && 
                       lng >= -180 && lng <= 180 && 
                       lat >= -90 && lat <= 90;
        log.push(`  -> 坐标有效性: ${isValid ? '✅' : '❌'}`);
        
        if (!isValid) {
          log.push(`  -> 错误详情: lng=${lng}, lat=${lat}`);
        }
      });
      
      // 检查数据库内容
      log.push('\n📊 坐标数据库统计:');
      log.push(`城市数量: ${Object.keys(CITY_COORDINATES).length}`);
      log.push(`景点数量: ${Object.keys(ATTRACTION_COORDINATES).length}`);
      
      // 显示一些样本数据
      log.push('\n📋 城市坐标样本:');
      Object.entries(CITY_COORDINATES).slice(0, 5).forEach(([city, coords]) => {
        log.push(`  ${city}: [${coords[0]}, ${coords[1]}]`);
      });
      
      log.push('\n📋 景点坐标样本:');
      Object.entries(ATTRACTION_COORDINATES).slice(0, 5).forEach(([attraction, coords]) => {
        log.push(`  ${attraction}: [${coords[0]}, ${coords[1]}]`);
      });
      
      log.push('\n🎯 调试完成！');
      
    } catch (error) {
      log.push(`❌ 调试过程中发生错误: ${error}`);
      console.error('坐标调试错误:', error);
    }
    
    setDebugResults(log.join('\n'));
  };

  useEffect(() => {
    testCoordinateGeneration();
  }, []);

  const handleRetest = () => {
    setDebugResults('');
    testCoordinateGeneration();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">坐标生成调试</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">调试结果</h2>
            <button
              onClick={handleRetest}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              重新测试
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <pre className="text-sm bg-gray-100 p-4 rounded whitespace-pre-wrap font-mono">
              {debugResults || '正在生成调试信息...'}
            </pre>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">调试说明</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 检查城市和景点坐标数据是否正确</li>
            <li>• 验证坐标生成函数是否返回有效数值</li>
            <li>• 确认坐标格式是否符合高德地图要求</li>
            <li>• 测试不同输入情况下的坐标生成结果</li>
          </ul>
        </div>
      </div>
    </div>
  );
}