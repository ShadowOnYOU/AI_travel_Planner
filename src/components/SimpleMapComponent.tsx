'use client';

import { useEffect, useRef, useState } from 'react';

import { MapPoint } from '@/types/travel';

interface SimpleMapProps {
  center?: [number, number];
  zoom?: number;
  points?: MapPoint[];
  className?: string;
  onPointClick?: (point: MapPoint) => void;
}

export default function SimpleMapComponent({
  center = [116.397428, 39.90923], // 默认北京天安门
  zoom = 13,
  points = [],
  className = 'w-full h-96',
  onPointClick
}: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        // 动态导入AMapLoader
        const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
        
        // 获取API Key
        const apiKey = process.env.NEXT_PUBLIC_AMAP_KEY || '1e967f9e5d863f52e8e76a8b7c381669';
        
        // 加载高德地图
        const AMap = await AMapLoader.load({
          key: apiKey,
          version: '2.0',
          plugins: [],
        });

        // 创建地图
        const map = new AMap.Map(mapRef.current, {
          zoom,
          center,
          mapStyle: 'amap://styles/normal',
        });

        // 等待地图加载完成
        map.on('complete', () => {
          setIsLoaded(true);
          
          // 添加标记
          if (points && points.length > 0) {
            points.forEach((point) => {
              try {
                // 简单的标记图标
                const getIcon = (type: string) => {
                  const icons: { [key: string]: string } = {
                    attraction: '🎯',
                    hotel: '🏨', 
                    restaurant: '🍽️',
                    transport: '🚇',
                    activity: '🎪'
                  };
                  return icons[type] || '📍';
                };

                const marker = new AMap.Marker({
                  position: point.coordinates,
                  title: point.name,
                  content: `<div style="
                    background: white; 
                    border: 2px solid #3B82F6; 
                    border-radius: 20px; 
                    padding: 5px 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    font-size: 14px;
                    white-space: nowrap;
                  ">
                    ${getIcon(point.type || 'attraction')} ${point.name}
                  </div>`,
                });

                // 添加点击事件
                if (onPointClick) {
                  marker.on('click', () => onPointClick(point));
                }

                map.add(marker);
              } catch (error) {
                console.warn('添加标记失败:', point.name, error);
              }
            });

            // 如果有多个点，调整视野
            if (points.length > 1) {
              try {
                const lngs = points.map(p => p.coordinates[0]);
                const lats = points.map(p => p.coordinates[1]);
                const bounds = new AMap.Bounds(
                  [Math.min(...lngs), Math.min(...lats)],
                  [Math.max(...lngs), Math.max(...lats)]
                );
                map.setBounds(bounds, false, [20, 20, 20, 20]);
              } catch (error) {
                console.warn('调整视野失败:', error);
              }
            }
          }
        });

      } catch (error) {
        console.error('地图初始化失败:', error);
        setError('地图加载失败，请检查网络连接');
      }
    };

    initMap();
  }, []); // 只在组件挂载时初始化一次

  // 错误显示
  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg`}>
        <div className="text-center p-6">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">正在加载地图...</div>
          </div>
        </div>
      )}
    </div>
  );
}