'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';

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

        // 动态导入AMapLoader避免SSR问题
        const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;

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

        // 等待地图完全加载
        mapInstance.on('complete', () => {
          console.log('✅ [MapComponent] 地图完全加载完成');
          setMap(mapInstance);
          setError(null);
        });
        
        console.log('🎯 [MapComponent] 地图实例创建完成，等待加载...');
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
    if (!map) {
      console.log('⏳ [MapComponent] 地图实例未就绪');
      return;
    }
    
    if (!stablePoints.length) {
      console.log('⏳ [MapComponent] 暂无地图点位数据');
      return;
    }

    console.log('🏷️ [MapComponent] 开始添加地图标记', stablePoints.length, '个点位');

    // 定义添加标记的函数
    const addMarkersToMap = () => {
      // 安全清理：检查方法是否存在
      try {
        if (typeof map.clearMap === 'function') {
          map.clearMap();
          console.log('🧹 [MapComponent] 清理现有标记完成');
        }
      } catch (error) {
        console.warn('⚠️ [MapComponent] 清理地图标记失败:', error);
      }
      
      let addedCount = 0;
      
      stablePoints.forEach((point: MapPoint, index: number) => {
      try {
        console.log(`📍 [MapComponent] 正在添加标记 ${index + 1}/${stablePoints.length}:`, {
          name: point.name,
          location: point.location,
          type: point.type
        });
        
        // 验证坐标有效性
        if (!Array.isArray(point.location) || point.location.length !== 2) {
          console.warn('⚠️ [MapComponent] 无效坐标格式:', point.location);
          return;
        }
        
        let [lng, lat] = point.location;
        
        // 确保坐标是数值类型
        lng = Number(lng);
        lat = Number(lat);
        
        if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
          console.warn('⚠️ [MapComponent] 坐标数值无效:', { originalLng: point.location[0], originalLat: point.location[1], lng, lat });
          return;
        }
        
        // 验证坐标范围（全球范围）
        if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
          console.warn('⚠️ [MapComponent] 坐标超出全球有效范围:', { lng, lat });
          return;
        }
        
        // 验证坐标范围（中国境内大致范围，给出警告但不阻止）
        if (lng < 73 || lng > 135 || lat < 3 || lat > 54) {
          console.warn('⚠️ [MapComponent] 坐标超出中国范围，但仍尝试显示:', { lng, lat });
        }
        
        // 四舍五入到合理精度（6位小数，约1米精度）
        lng = Math.round(lng * 1000000) / 1000000;
        lat = Math.round(lat * 1000000) / 1000000;

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

        // 检查AMap和Marker类是否可用
        if (!(window as any).AMap || !(window as any).AMap.Marker) {
          console.warn('⚠️ [MapComponent] AMap.Marker不可用');
          return;
        }

        // 创建位置对象，确保坐标格式正确
        let position;
        try {
          // 尝试多种创建位置对象的方式
          if ((window as any).AMap && (window as any).AMap.LngLat) {
            position = new (window as any).AMap.LngLat(lng, lat);
          } else {
            // 如果LngLat类不可用，直接使用数组格式
            position = [lng, lat];
            console.log('📍 [MapComponent] 使用数组格式坐标:', position);
          }
          
          // 验证位置对象
          if (!position) {
            throw new Error('位置对象创建失败');
          }
          
          console.log('✅ [MapComponent] 位置对象创建成功:', {
            name: point.name,
            originalCoords: point.location,
            processedCoords: [lng, lat],
            position: position
          });
          
        } catch (error) {
          console.warn('⚠️ [MapComponent] 创建位置对象失败:', error, { lng, lat });
          // 降级使用数组格式
          position = [lng, lat];
          console.log('🔄 [MapComponent] 降级使用数组格式:', position);
        }

        const marker = new (window as any).AMap.Marker({
          position: position,
          title: point.name,
          content: `<div style="background: white; border-radius: 8px; padding: 4px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #ddd;">
                      <span style="font-size: 16px;">${getMarkerIcon(point.type)}</span>
                      <span style="margin-left: 4px; font-size: 12px; font-weight: 500;">${point.name}</span>
                    </div>`,
          anchor: 'center',
        });

        // 添加点击事件
        marker.on('click', () => {
          console.log('🎯 [MapComponent] 标记点击:', point.name);
          if (onPointClick) {
            onPointClick(point);
          }
        });

        map.add(marker);
        addedCount++;
        
        console.log(`✅ [MapComponent] 标记添加成功: ${point.name}`);
      } catch (error) {
        console.warn('❌ [MapComponent] 添加地图标记失败:', error, point);
      }
    });
      
      console.log(`🎯 [MapComponent] 标记添加完成: ${addedCount}/${stablePoints.length}`);

      // 简单的路线绘制
      if (showRoutes && stablePoints.length > 1) {
        try {
          // 按照ID排序点位
          const sortedPoints = [...stablePoints].sort((a, b) => {
            const [dayA, itemA] = a.id.split('-').map(Number);
            const [dayB, itemB] = b.id.split('-').map(Number);
            return dayA !== dayB ? dayA - dayB : itemA - itemB;
          });

          const pathCoordinates = sortedPoints.map((point: MapPoint) => point.location);
          
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
          stablePoints.forEach((point: MapPoint) => {
            bounds.extend(point.location);
          });
          map.setBounds(bounds, false, [50, 50, 50, 50]);
        } else if (stablePoints.length === 1) {
          map.setCenter(stablePoints[0].location);
        }
      } catch (error) {
        console.warn('调整地图视野失败:', error);
      }
    };

    // 延迟添加标记，确保地图完全初始化
    const timeoutId = setTimeout(() => {
      addMarkersToMap();
    }, 100);

    // 清理函数
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [map, stablePoints, showRoutes]);

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