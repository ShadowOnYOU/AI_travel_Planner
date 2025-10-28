// 导航相关的工具函数

export type NavigationType = 'walking' | 'driving' | 'transit';

export interface NavigationOption {
  type: NavigationType;
  name: string;
  icon: string;
  description: string;
}

export const navigationOptions: NavigationOption[] = [
  {
    type: 'walking',
    name: '步行',
    icon: '🚶',
    description: '步行导航'
  },
  {
    type: 'driving',
    name: '驾车',
    icon: '🚗',
    description: '驾车导航'
  },
  {
    type: 'transit',
    name: '公交',
    icon: '🚌',
    description: '公共交通'
  }
];

/**
 * 获取用户当前位置
 */
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * 打开高德地图进行导航
 */
export function openAmapNavigation(
  destination: [number, number], 
  destinationName: string,
  type: NavigationType = 'driving'
) {
  const [lng, lat] = destination;
  
  // 高德地图URI Scheme
  let url = '';
  
  switch (type) {
    case 'walking':
      url = `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(destinationName)}&mode=walk`;
      break;
    case 'driving':
      url = `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(destinationName)}&mode=car`;
      break;
    case 'transit':
      url = `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(destinationName)}&mode=bus`;
      break;
  }
  
  // 在新窗口打开导航
  window.open(url, '_blank');
}

/**
 * 打开百度地图进行导航
 */
export function openBaiduNavigation(
  destination: [number, number], 
  destinationName: string,
  type: NavigationType = 'driving'
) {
  const [lng, lat] = destination;
  
  // 百度地图URI Scheme
  let mode = 'driving';
  switch (type) {
    case 'walking':
      mode = 'walking';
      break;
    case 'driving':
      mode = 'driving';
      break;
    case 'transit':
      mode = 'transit';
      break;
  }
  
  const url = `https://api.map.baidu.com/direction?destination=${lat},${lng}&mode=${mode}&region=${encodeURIComponent(destinationName)}&output=html&src=webapp.baidu.openapi`;
  
  window.open(url, '_blank');
}

/**
 * 打开腾讯地图进行导航
 */
export function openTencentNavigation(
  destination: [number, number], 
  destinationName: string,
  type: NavigationType = 'driving'
) {
  const [lng, lat] = destination;
  
  let policy = 0; // 默认驾车
  switch (type) {
    case 'walking':
      policy = 3;
      break;
    case 'driving':
      policy = 0;
      break;
    case 'transit':
      policy = 1;
      break;
  }
  
  const url = `https://apis.map.qq.com/uri/v1/routeplan?type=${type}&to=${encodeURIComponent(destinationName)}&tocoord=${lat},${lng}&policy=${policy}`;
  
  window.open(url, '_blank');
}

/**
 * 智能选择导航应用
 */
export function smartNavigation(
  destination: [number, number], 
  destinationName: string,
  type: NavigationType = 'driving'
) {
  // 检测用户设备和偏好，选择合适的导航应用
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('micromessenger')) {
    // 微信环境，使用腾讯地图
    openTencentNavigation(destination, destinationName, type);
  } else if (userAgent.includes('alipay')) {
    // 支付宝环境，使用高德地图
    openAmapNavigation(destination, destinationName, type);
  } else {
    // 默认使用高德地图
    openAmapNavigation(destination, destinationName, type);
  }
}

/**
 * 计算两点之间的步行时间（分钟）
 */
export function estimateWalkingTime(distance: number): number {
  // 假设步行速度为 5km/h
  const walkingSpeedKmh = 5;
  const timeHours = distance / walkingSpeedKmh;
  return Math.round(timeHours * 60);
}

/**
 * 计算两点之间的驾车时间（分钟）
 */
export function estimateDrivingTime(distance: number): number {
  // 假设市内驾车平均速度为 30km/h
  const drivingSpeedKmh = 30;
  const timeHours = distance / drivingSpeedKmh;
  return Math.round(timeHours * 60);
}