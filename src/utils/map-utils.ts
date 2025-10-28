// 地图相关的工具函数

export interface Location {
  lng: number;
  lat: number;
}

export interface GeocodeResult {
  location: Location;
  address: string;
  city: string;
}

/**
 * 地理编码：将地址转换为经纬度
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    // 这里使用高德地图的地理编码服务
    // 在实际应用中，你需要替换为真实的API调用
    
    // 模拟数据 - 一些常见城市的坐标
    const cityCoordinates: Record<string, Location> = {
      '北京': { lng: 116.397428, lat: 39.90923 },
      '上海': { lng: 121.473701, lat: 31.230416 },
      '广州': { lng: 113.280637, lat: 23.125178 },
      '深圳': { lng: 114.085947, lat: 22.547 },
      '杭州': { lng: 120.153576, lat: 30.287459 },
      '南京': { lng: 118.767413, lat: 32.041544 },
      '成都': { lng: 104.065735, lat: 30.659462 },
      '西安': { lng: 108.948024, lat: 34.263161 },
      '武汉': { lng: 114.298572, lat: 30.584355 },
      '重庆': { lng: 106.504962, lat: 29.533155 },
      '天津': { lng: 117.190182, lat: 39.125596 },
      '苏州': { lng: 120.619585, lat: 31.317987 },
      '青岛': { lng: 120.355173, lat: 36.082982 },
      '长沙': { lng: 112.982279, lat: 28.19409 },
      '大连': { lng: 121.618622, lat: 38.91459 }
    };

    // 简单匹配城市名称
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (address.includes(city)) {
        return {
          location: coords,
          address: address,
          city: city
        };
      }
    }

    // 如果没有匹配到，返回默认北京坐标
    console.warn(`未找到城市 "${address}" 的坐标，使用默认坐标`);
    return {
      location: cityCoordinates['北京'],
      address: address,
      city: '北京'
    };
  } catch (error) {
    console.error('地理编码失败:', error);
    return null;
  }
}

/**
 * 从行程数据中提取地图点位
 */
export async function extractMapPointsFromItinerary(itinerary: any) {
  const points: any[] = [];
  
  if (!itinerary || !itinerary.days) return points;

  // 遍历每一天的行程
  for (const [dayIndex, day] of itinerary.days.entries()) {
    if (!day.items) continue;

    for (const [itemIndex, item] of day.items.entries()) {
      // 尝试获取坐标
      let location: [number, number] | null = null;
      
      if (item.coordinates) {
        location = [item.coordinates.lng, item.coordinates.lat];
      } else if (item.location) {
        // 尝试地理编码
        try {
          const geocoded = await geocodeAddress(item.location);
          if (geocoded) {
            location = [geocoded.location.lng, geocoded.location.lat];
          }
        } catch (error) {
          console.warn('地理编码失败:', item.location);
        }
      }

      if (location) {
        points.push({
          id: `${dayIndex}-${itemIndex}`,
          name: item.title || item.name || '未知地点',
          location: location,
          type: mapItemTypeToMapType(item.type),
          description: item.description || '',
          time: item.time || '',
          cost: item.cost || 0,
          duration: item.duration || 0
        });
      }
    }
  }

  return points;
}

/**
 * 将行程项目类型映射到地图标记类型
 */
function mapItemTypeToMapType(itemType: string): 'attraction' | 'hotel' | 'restaurant' | 'transport' {
  switch (itemType) {
    case 'attraction':
      return 'attraction';
    case 'hotel':
    case 'accommodation':
      return 'hotel';
    case 'restaurant':
    case 'food':
      return 'restaurant';
    case 'transport':
    case 'transportation':
      return 'transport';
    default:
      return 'attraction';
  }
}

/**
 * 计算两点之间的距离（公里）
 */
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // 地球半径（公里）
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 为行程项目添加模拟坐标
 */
export async function addCoordinatesToItinerary(itinerary: any) {
  if (!itinerary || !itinerary.days) return itinerary;

  const updatedItinerary = { ...itinerary };
  
  // 获取目的地的基础坐标
  const baseLocation = await geocodeAddress(itinerary.destination);
  if (!baseLocation) return itinerary;

  updatedItinerary.days = await Promise.all(
    itinerary.days.map(async (day: any) => {
      if (!day.items) return day;

      const updatedItems = await Promise.all(
        day.items.map(async (item: any) => {
          if (item.coordinates) return item; // 已有坐标

          // 为每个项目添加随机偏移的坐标（模拟不同地点）
          const offsetLng = (Math.random() - 0.5) * 0.02; // 约1-2公里的随机偏移
          const offsetLat = (Math.random() - 0.5) * 0.02;

          return {
            ...item,
            coordinates: {
              lng: baseLocation.location.lng + offsetLng,
              lat: baseLocation.location.lat + offsetLat
            }
          };
        })
      );

      return {
        ...day,
        items: updatedItems
      };
    })
  );

  return updatedItinerary;
}