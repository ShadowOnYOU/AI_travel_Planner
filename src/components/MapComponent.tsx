'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

export interface MapPoint {
  id: string;
  name: string;
  location: [number, number]; // [经度, 纬度]
  type: 'attraction' | 'hotel' | 'restaurant' | 'transport' | 'activity';
  description?: string;
  time?: string;
  cost?: number;
  duration?: number;
  day?: number; // 添加天数属性，用于筛选
}

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  points?: MapPoint[];
  showRoutes?: boolean;
  className?: string;
  onPointClick?: (point: MapPoint) => void;
}

export default function MapComponent({
  center = [116.397428, 39.90923], // 默认北京天安门
  zoom = 13,
  points = [],
  showRoutes = true,
  className = 'w-full h-96',
  onPointClick
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 稳定化 points 数组的引用
  const stablePoints = useMemo(() => points, [JSON.stringify(points)]);

  // 获取高德地图API Key
  const getAMapKey = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('amap_api_key') || process.env.NEXT_PUBLIC_AMAP_KEY || process.env.NEXT_PUBLIC_AMAP_API_KEY || 'your_amap_api_key';
    }
    return 'your_amap_api_key';
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        console.log('🗺️ [MapComponent] 开始初始化地图');
        setIsLoading(true);
        const apiKey = getAMapKey();
        
        console.log('🔑 [MapComponent] API Key获取结果:', apiKey === 'your_amap_api_key' ? '未配置' : '已配置');
        
        if (apiKey === 'your_amap_api_key') {
          console.warn('⚠️ [MapComponent] API Key未配置');
          setError('请在设置中配置高德地图API Key');
          setIsLoading(false);
          return;
        }

        console.log('🔄 [MapComponent] 加载高德地图SDK', {
          key: apiKey.substring(0, 8) + '...',
          version: '2.0',
          plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.MapType']
        });

        const AMap = await AMapLoader.load({
          key: apiKey,
          version: '2.0',
          plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.MapType'],
        });

        console.log('✅ [MapComponent] 高德地图SDK加载成功');

        const mapConfig = {
          zoom,
          center,
          mapStyle: 'amap://styles/normal',
          viewMode: '2D',
        };
        console.log('🏗️ [MapComponent] 创建地图实例', mapConfig);

        const mapInstance = new AMap.Map(mapRef.current, mapConfig);

        // 添加控件
        console.log('🎛️ [MapComponent] 添加地图控件');
        mapInstance.addControl(new AMap.Scale());
        mapInstance.addControl(new AMap.ToolBar());

        console.log('✅ [MapComponent] 地图初始化完成');
        setMap(mapInstance);
        setError(null);
      } catch (err) {
        console.error('❌ [MapComponent] 地图初始化失败:', err);
        console.error('❌ [MapComponent] 错误详情:', {
          name: (err as any)?.name,
          message: (err as any)?.message,
          stack: (err as any)?.stack
        });
        setError('地图加载失败，请检查网络连接和API Key');
      } finally {
        console.log('🏁 [MapComponent] 地图初始化流程结束');
        setIsLoading(false);
      }
    };

    initMap();

    // 清理函数：安全地销毁地图
    return () => {
      if (map && typeof map.destroy === 'function') {
        try {
          map.destroy();
        } catch (error) {
          console.warn('销毁地图失败:', error);
        }
      }
    };
  }, []);  // 只在组件挂载时初始化地图

  // 更新地图中心和缩放级别
  useEffect(() => {
    if (map) {
      try {
        console.log('📍 [MapComponent] 更新地图视野', { center, zoom });
        map.setCenter(center);
        map.setZoom(zoom);
        console.log('✅ [MapComponent] 地图视野更新成功');
      } catch (error) {
        console.warn('⚠️ [MapComponent] 更新地图视野失败:', error);
      }
    }
  }, [map, center, zoom]);

  // 添加地图标记
  useEffect(() => {
    if (!map || !stablePoints.length) return;

    // 安全清理：检查方法是否存在
    try {
      if (typeof map.clearMap === 'function') {
        map.clearMap();
      }
    } catch (error) {
      console.warn('清理地图标记失败:', error);
    }
    
    stablePoints.forEach((point) => {
      try {
        // 根据类型设置不同的标记图标
        const getMarkerIcon = (type: string) => {
          const icons = {
            attraction: '🎯',
            hotel: '🏨',
            restaurant: '🍽️',
            transport: '🚇'
          };
          return icons[type as keyof typeof icons] || '📍';
        };

        const marker = new (window as any).AMap.Marker({
          position: point.location,
          title: point.name,
          content: `<div style="background: white; border-radius: 8px; padding: 4px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #ddd;">
                      <span style="font-size: 16px;">${getMarkerIcon(point.type)}</span>
                      <span style="margin-left: 4px; font-size: 12px; font-weight: 500;">${point.name}</span>
                    </div>`,
          anchor: 'center',
        });

        // 添加点击事件
        marker.on('click', () => {
          if (onPointClick) {
            onPointClick(point);
          }
        });

        map.add(marker);
      } catch (error) {
        console.warn('添加地图标记失败:', error, point);
      }
    });

    // 简单的路线绘制
    if (showRoutes && stablePoints.length > 1) {
      try {
        // 按照ID排序点位
        const sortedPoints = [...stablePoints].sort((a, b) => {
          const [dayA, itemA] = a.id.split('-').map(Number);
          const [dayB, itemB] = b.id.split('-').map(Number);
          return dayA !== dayB ? dayA - dayB : itemA - itemB;
        });

        const pathCoordinates = sortedPoints.map(point => point.location);
        
        const polyline = new (window as any).AMap.Polyline({
          path: pathCoordinates,
          strokeColor: '#3B82F6',
          strokeWeight: 3,
          strokeOpacity: 0.8,
        });
        
        map.add(polyline);
      } catch (error) {
        console.warn('绘制路线失败:', error);
      }
    }

    // 自动调整地图视野
    try {
      if (stablePoints.length > 1) {
        const bounds = new (window as any).AMap.Bounds();
        stablePoints.forEach(point => {
          bounds.extend(point.location);
        });
        map.setBounds(bounds, false, [50, 50, 50, 50]);
      } else if (stablePoints.length === 1) {
        map.setCenter(stablePoints[0].location);
      }
    } catch (error) {
      console.warn('调整地图视野失败:', error);
    }

    // 清理函数：简化清理逻辑，避免复杂的API调用
    return () => {
      // 不进行复杂的清理操作，让组件卸载时自然清理
      // 这样可以避免在map对象不完整时的错误
    };
  }, [map, stablePoints, showRoutes]);  // 使用稳定的 points 引用

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg`}>
        <div className="text-center p-6">
          <div className="text-6xl mb-4">🗺️</div>
          <div className="text-gray-600 mb-2">{error}</div>
          <div className="text-sm text-gray-500">
            请在页面设置中配置高德地图API Key
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      {isLoading && (
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