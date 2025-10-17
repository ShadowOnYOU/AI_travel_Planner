'use client';

import { useState } from 'react';
import WebSpeechInput from '../../../components/WebSpeechInput';

export default function WebSpeechTestPage() {
  const [destination, setDestination] = useState('');
  const [preferences, setPreferences] = useState('');
  const [budget, setBudget] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎤 Web语音识别测试
            </h1>
            <p className="text-gray-600">
              测试浏览器原生语音识别功能，支持中文语音转文字
            </p>
          </div>

          {/* 测试区域 */}
          <div className="space-y-8">
            {/* 目的地输入 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                ✈️ 旅行目的地
              </h2>
              <WebSpeechInput
                value={destination}
                onChange={setDestination}
                placeholder="说出您想去的地方，例如：我想去北京旅游，或者直接输入文字"
                className="w-full"
              />
              
              {destination && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">识别结果:</h3>
                  <p className="text-blue-700">{destination}</p>
                </div>
              )}
            </div>

            {/* 旅行偏好输入 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                💝 旅行偏好
              </h2>
              <WebSpeechInput
                value={preferences}
                onChange={setPreferences}
                placeholder="描述您的旅行偏好，例如：我喜欢历史文化景点和美食"
                className="w-full"
              />
              
              {preferences && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">识别结果:</h3>
                  <p className="text-green-700">{preferences}</p>
                </div>
              )}
            </div>

            {/* 预算输入 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                💰 预算范围
              </h2>
              <WebSpeechInput
                value={budget}
                onChange={setBudget}
                placeholder="说出您的预算，例如：预算三千元或者五千左右"
                className="w-full"
              />
              
              {budget && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">识别结果:</h3>
                  <p className="text-purple-700">{budget}</p>
                </div>
              )}
            </div>
          </div>

          {/* 使用说明 */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🔧 使用说明
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 点击蓝色麦克风按钮开始语音输入</li>
              <li>• 支持中文普通话识别</li>
              <li>• 可以手动输入文字或语音输入</li>
              <li>• 点击清除按钮可以清空内容</li>
              <li>• 需要授权麦克风权限（首次使用）</li>
              <li>• 推荐使用 Chrome、Safari 或 Edge 浏览器</li>
            </ul>
          </div>

          {/* 技术对比 */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                🌐 Web Speech API
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <strong>实现方式:</strong>
                  <span className="text-blue-600">浏览器原生</span>
                </div>
                <div className="flex justify-between">
                  <strong>配置需求:</strong>
                  <span className="text-green-600">无需配置</span>
                </div>
                <div className="flex justify-between">
                  <strong>网络要求:</strong>
                  <span className="text-yellow-600">需要网络</span>
                </div>
                <div className="flex justify-between">
                  <strong>浏览器支持:</strong>
                  <span className="text-blue-600">现代浏览器</span>
                </div>
                <div className="flex justify-between">
                  <strong>使用成本:</strong>
                  <span className="text-green-600">免费</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-orange-50 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">
                🎯 科大讯飞 API
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <strong>实现方式:</strong>
                  <span className="text-orange-600">WebSocket API</span>
                </div>
                <div className="flex justify-between">
                  <strong>配置需求:</strong>
                  <span className="text-red-600">需要密钥</span>
                </div>
                <div className="flex justify-between">
                  <strong>识别准确率:</strong>
                  <span className="text-green-600">很高</span>
                </div>
                <div className="flex justify-between">
                  <strong>中文支持:</strong>
                  <span className="text-green-600">专业优化</span>
                </div>
                <div className="flex justify-between">
                  <strong>使用成本:</strong>
                  <span className="text-yellow-600">有限免费</span>
                </div>
              </div>
            </div>
          </div>

          {/* 返回按钮 */}
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              返回首页
            </a>
            <a
              href="/test/speech"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              讯飞版本
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}