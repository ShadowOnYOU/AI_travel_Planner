'use client';

import { useState } from 'react';
import { MapPoint } from './MapComponent';
import { 
  NavigationType, 
  navigationOptions, 
  smartNavigation,
  openAmapNavigation,
  openBaiduNavigation,
  openTencentNavigation,
  getCurrentLocation,
  estimateWalkingTime,
  estimateDrivingTime
} from '@/utils/navigation-utils';
import { calculateDistance } from '@/utils/map-utils';

interface NavigationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  destination: MapPoint | null;
}

export default function NavigationPanel({ isOpen, onClose, destination }: NavigationPanelProps) {
  const [selectedType, setSelectedType] = useState<NavigationType>('driving');
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  // 获取当前位置
  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const position = await getCurrentLocation();
      setCurrentLocation(position);
      
      if (destination) {
        const dist = calculateDistance(
          { lng: position.coords.longitude, lat: position.coords.latitude },
          { lng: destination.location[0], lat: destination.location[1] }
        );
        setDistance(dist);
      }
    } catch (error) {
      console.error('获取位置失败:', error);
      alert('无法获取当前位置，请检查定位权限设置');
    } finally {
      setIsLocating(false);
    }
  };

  // 开始导航
  const handleNavigate = (navType: 'smart' | 'amap' | 'baidu' | 'tencent') => {
    if (!destination) return;

    const destLocation: [number, number] = destination.location;
    const destName = destination.name;

    switch (navType) {
      case 'smart':
        smartNavigation(destLocation, destName, selectedType);
        break;
      case 'amap':
        openAmapNavigation(destLocation, destName, selectedType);
        break;
      case 'baidu':
        openBaiduNavigation(destLocation, destName, selectedType);
        break;
      case 'tencent':
        openTencentNavigation(destLocation, destName, selectedType);
        break;
    }
  };

  if (!isOpen || !destination) return null;

  const walkingTime = distance ? estimateWalkingTime(distance) : null;
  const drivingTime = distance ? estimateDrivingTime(distance) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🧭 导航到</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 目的地信息 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{destination.type === 'attraction' ? '🎯' : 
                                      destination.type === 'hotel' ? '🏨' : 
                                      destination.type === 'restaurant' ? '🍽️' : '🚇'}</span>
            <h3 className="font-semibold">{destination.name}</h3>
          </div>
          {destination.description && (
            <p className="text-sm text-gray-600">{destination.description}</p>
          )}
          {destination.time && (
            <p className="text-sm text-blue-600 mt-1">⏰ {destination.time}</p>
          )}
        </div>

        {/* 当前位置 */}
        <div className="mb-4">
          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isLocating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>正在定位...</span>
              </>
            ) : currentLocation ? (
              <>
                <span>📍</span>
                <span>当前位置已获取</span>
              </>
            ) : (
              <>
                <span>📍</span>
                <span>获取当前位置</span>
              </>
            )}
          </button>
          
          {distance && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              距离: {distance.toFixed(1)}km
              {walkingTime && ` • 步行约 ${walkingTime} 分钟`}
              {drivingTime && ` • 驾车约 ${drivingTime} 分钟`}
            </div>
          )}
        </div>

        {/* 导航方式选择 */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">选择导航方式</h4>
          <div className="grid grid-cols-3 gap-2">
            {navigationOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setSelectedType(option.type)}
                className={`p-3 text-center border rounded-lg transition-colors ${
                  selectedType === option.type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-sm font-medium">{option.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 导航应用选择 */}
        <div className="space-y-2">
          <h4 className="font-medium mb-3">选择导航应用</h4>
          
          <button
            onClick={() => handleNavigate('smart')}
            className="w-full flex items-center justify-between p-3 border border-blue-500 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            <div className="flex items-center gap-2">
              <span>🤖</span>
              <span className="font-medium">智能选择</span>
            </div>
            <span className="text-sm">推荐</span>
          </button>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleNavigate('amap')}
              className="flex flex-col items-center gap-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span className="text-lg">🗺️</span>
              <span className="text-sm">高德地图</span>
            </button>
            
            <button
              onClick={() => handleNavigate('baidu')}
              className="flex flex-col items-center gap-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span className="text-lg">🧭</span>
              <span className="text-sm">百度地图</span>
            </button>
            
            <button
              onClick={() => handleNavigate('tencent')}
              className="flex flex-col items-center gap-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span className="text-lg">📍</span>
              <span className="text-sm">腾讯地图</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          点击导航按钮将在新窗口中打开对应的地图应用
        </div>
      </div>
    </div>
  );
}