import { generateResponse } from './bailian-api';
import { MapPoint } from '@/types/travel';

export interface RouteDetailResponse {
  transportation: string;
  duration: string;
  distance: string;
  cost?: string;
  route: string;
  tips?: string;
}

/**
 * 从文本中提取路线信息的辅助函数
 */
function extractRouteInfoFromText(text: string): RouteDetailResponse {
  const defaultData: RouteDetailResponse = {
    transportation: '步行/公共交通',
    duration: '约15-30分钟',
    distance: '约1-3公里',
    route: text
  };

  try {
    // 简单的文本解析尝试
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    for (const line of lines) {
      // 尝试提取交通方式
      if (line.includes('交通') || line.includes('方式')) {
        const match = line.match(/[:：]\s*(.+)/);
        if (match) defaultData.transportation = match[1];
      }
      // 尝试提取时间
      else if (line.includes('时间') || line.includes('用时')) {
        const match = line.match(/[:：]\s*(.+)/);
        if (match) defaultData.duration = match[1];
      }
      // 尝试提取距离
      else if (line.includes('距离')) {
        const match = line.match(/[:：]\s*(.+)/);
        if (match) defaultData.distance = match[1];
      }
      // 尝试提取费用
      else if (line.includes('费用') || line.includes('价格')) {
        const match = line.match(/[:：]\s*(.+)/);
        if (match) defaultData.cost = match[1];
      }
    }
    
    return defaultData;
  } catch (error) {
    console.warn('文本解析失败，返回默认数据:', error);
    return defaultData;
  }
}

export class RouteService {
  /**
   * 获取两点间的详细路径规划
   */
  static async getDetailedRoute(
    fromPoint: MapPoint, 
    toPoint: MapPoint,
    city: string = ''
  ): Promise<RouteDetailResponse> {
    try {
      const prompt = `请为以下两个地点之间提供路线规划建议：

起点：${fromPoint.name} (${fromPoint.type})
终点：${toPoint.name} (${toPoint.type})
城市：${city}

请直接返回一个JSON对象，不要包含任何其他文字或格式标记：
{
  "transportation": "推荐的交通方式",
  "duration": "预计用时",
  "distance": "大概距离", 
  "cost": "大致费用",
  "route": "详细路线和乘车指南",
  "tips": "实用小贴士"
}`;

      const response = await generateResponse(prompt);
      
      // 清理响应，去除可能的代码块标记
      let cleanedResponse = response.trim();
      
      // 去除 ```json 和 ``` 标记
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // 尝试解析JSON响应
      try {
        const parsed = JSON.parse(cleanedResponse);
        return parsed;
      } catch (parseError) {
        console.warn('无法解析AI响应为JSON:', parseError);
        console.warn('原始响应:', response);
        console.warn('清理后响应:', cleanedResponse);
        
        // 如果无法解析JSON，尝试从文本中提取信息
        const fallbackData = extractRouteInfoFromText(cleanedResponse);
        return fallbackData;
      }
    } catch (error) {
      console.error('获取路径规划失败:', error);
      throw new Error('获取路径规划失败，请稍后重试');
    }
  }

  /**
   * 获取一天内所有地点的优化路线
   */
  static async getOptimizedDayRoute(
    points: MapPoint[],
    city: string = ''
  ): Promise<string> {
    try {
      const pointsList = points
        .filter(p => p.type !== 'transport')
        .map((p, index) => `${index + 1}. ${p.name} (${p.type})`)
        .join('\n');

      const prompt = `
请为以下${city}的一日游地点提供优化的游览顺序和路线建议：

地点列表：
${pointsList}

请考虑：
1. 地理位置的合理性
2. 开放时间和最佳游览时间
3. 交通便利性
4. 游览体验的连贯性

请提供优化后的顺序和整体路线建议。
`;

      const response = await generateResponse(prompt);
      return response;
    } catch (error) {
      console.error('获取优化路线失败:', error);
      throw new Error('获取优化路线失败，请稍后重试');
    }
  }
}
