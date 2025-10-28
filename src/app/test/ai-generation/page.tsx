'use client';

import { useState } from 'react';
import { generateItinerary } from '@/lib/bailian-api';
import { AIGenerationRequest } from '@/types/ai';

export default function AIGenerationTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testRequest: AIGenerationRequest = {
    destination: '北京',
    startDate: '2024-12-20',
    endDate: '2024-12-22',
    budget: 3000,
    travelers: 2,
    travelStyle: 'cultural',
    preferences: '喜欢历史文化，想尝试北京特色美食',
    transportation: 'metro',
    accommodation: 'hotel',
    interests: ['history', 'food', 'architecture']
  };

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('开始生成AI行程...');
      const itinerary = await generateItinerary(testRequest);
      setResult(itinerary);
      console.log('AI行程生成成功:', itinerary);
    } catch (err) {
      console.error('AI行程生成失败:', err);
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          AI 行程生成测试
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">测试参数</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(testRequest, null, 2)}
          </pre>
          
          <button
            onClick={handleTest}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '生成中...' : '开始测试'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="text-red-800 font-semibold mb-2">错误信息</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">生成结果</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">基本信息</h3>
                <p><strong>行程ID:</strong> {result.id}</p>
                <p><strong>标题:</strong> {result.title}</p>
                <p><strong>描述:</strong> {result.description}</p>
                <p><strong>总费用:</strong> ¥{result.totalCost}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">日程安排</h3>
                {result.days?.map((day: any, index: number) => (
                  <div key={index} className="border rounded p-4 mb-4">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      第{day.day}天 - {day.date}
                    </h4>
                    <p className="mb-2">{day.description}</p>
                    
                    {day.activities?.map((activity: any, actIndex: number) => (
                      <div key={actIndex} className="ml-4 mb-3 border-l-2 border-gray-200 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{activity.name}</h5>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              📍 {activity.location?.address || '地址待补充'}
                            </p>
                            <p className="text-xs text-blue-600">
                              ⏰ {activity.time} | 💰 ¥{activity.cost}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-2 pt-2 border-t">
                      <p><strong>当日费用:</strong> ¥{day.totalCost}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-2">完整JSON数据</h3>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}