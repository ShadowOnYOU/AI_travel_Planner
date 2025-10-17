'use client';

import { useState } from 'react';
import SpeechInput from '../../../components/SpeechInput';

export default function SpeechTestPage() {
  const [destination, setDestination] = useState('');
  const [preferences, setPreferences] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎤 语音识别测试
            </h1>
            <p className="text-gray-600">
              测试讯飞语音识别功能，支持中文语音转文字
            </p>
          </div>

          {/* 测试区域 */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* 目的地输入 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                旅行目的地
              </h2>
              <SpeechInput
                value={destination}
                onChange={setDestination}
                placeholder="说出您想去的地方，如：我想去北京旅游"
                className="w-full"
                maxDuration={30}
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
              <h2 className="text-xl font-semibold text-gray-800">
                旅行偏好
              </h2>
              <SpeechInput
                value={preferences}
                onChange={setPreferences}
                placeholder="描述您的旅行偏好，如：我喜欢历史文化景点"
                className="w-full"
                maxDuration={60}
              />
              
              {preferences && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">识别结果:</h3>
                  <p className="text-green-700">{preferences}</p>
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
              <li>• 点击麦克风按钮开始语音输入</li>
              <li>• 支持中文普通话识别</li>
              <li>• 可以手动输入文字或语音输入</li>
              <li>• 点击清除按钮可以清空内容</li>
              <li>• 需要授权麦克风权限</li>
            </ul>
          </div>

          {/* 技术信息 */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              🔬 技术信息
            </h3>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <strong className="text-blue-800">语音识别服务:</strong>
                <p className="text-blue-600">科大讯飞语音听写API</p>
              </div>
              <div>
                <strong className="text-blue-800">支持语言:</strong>
                <p className="text-blue-600">中文普通话</p>
              </div>
              <div>
                <strong className="text-blue-800">音频格式:</strong>
                <p className="text-blue-600">PCM 16kHz 16bit</p>
              </div>
              <div>
                <strong className="text-blue-800">连接方式:</strong>
                <p className="text-blue-600">WebSocket 实时流式</p>
              </div>
            </div>
          </div>

          {/* 返回按钮 */}
          <div className="mt-8 flex justify-center">
            <a
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}