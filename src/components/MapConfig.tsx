'use client';

import { useState, useEffect } from 'react';

interface MapConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapConfig({ isOpen, onClose }: MapConfigProps) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('amap_api_key') || '';
      setApiKey(savedKey);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setMessage('请输入有效的API Key');
      return;
    }

    setIsLoading(true);
    try {
      // 保存到本地存储
      localStorage.setItem('amap_api_key', apiKey.trim());
      setMessage('API Key 保存成功！页面将刷新以应用设置。');
      
      // 延迟刷新页面
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('amap_api_key');
    setApiKey('');
    setMessage('API Key 已清除');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">地图配置</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            高德地图 API Key
          </label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="请输入您的高德地图API Key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            获取方式：访问 <a href="https://console.amap.com/" target="_blank" className="text-blue-500 underline">高德开放平台</a> 注册并创建应用
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-md text-sm ${
            message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            清除
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}