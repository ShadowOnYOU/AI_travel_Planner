import { TravelRequirements } from '@/types/travel';
import { AIPromptTemplate, AIGenerationRequest } from '@/types/ai';

/**
 * 生成旅行规划的系统提示词
 */
export function createSystemPrompt(): string {
  return `你是一个专业的AI旅行规划师，具有丰富的旅行规划经验和当地知识。你的任务是根据用户的需求生成详细、实用、个性化的旅行行程。

请严格按照以下JSON格式返回行程数据，不要包含任何其他文字说明：

{
  "id": "生成唯一ID",
  "title": "行程标题",
  "destination": "目的地",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD", 
  "totalDays": 天数,
  "totalBudget": 总预算,
  "actualCost": 实际预估费用,
  "travelers": 旅行人数,
  "travelStyle": "旅行风格",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "totalCost": 当日总费用,
      "summary": "当日行程概要",
      "items": [
        {
          "id": "项目ID",
          "day": 1,
          "time": "09:00",
          "title": "景点/活动名称",
          "description": "详细描述",
          "location": "具体地址",
          "type": "attraction|restaurant|hotel|transport|activity",
          "duration": 停留时间(分钟),
          "cost": 费用,
          "notes": "注意事项"
        }
      ]
    }
  ],
  "summary": "整体行程总结",
  "recommendations": ["推荐1", "推荐2", "推荐3"],
  "createdAt": "当前时间ISO字符串"
}

规划要求：
1. 行程安排要合理，考虑交通时间和景点开放时间
2. 预算分配要详细，包括门票、餐饮、交通、住宿等
3. 推荐的景点和活动要符合用户的兴趣偏好
4. 考虑当地的天气、季节等因素
5. 提供实用的旅行建议和注意事项
6. 时间安排要松紧适度，避免过于紧凑
7. 餐饮推荐要包含当地特色
8. 住宿建议要符合预算和风格要求
9. 交通安排要便捷高效
10. 费用估算要尽可能准确和实际`;
}

/**
 * 生成用户需求提示词
 */
export function createUserPrompt(requirements: AIGenerationRequest): string {
  const {
    destination,
    startDate,
    endDate,
    budget,
    travelers,
    travelStyle,
    preferences,
    transportation,
    accommodation,
    interests
  } = requirements;

  const interestsList = interests.length > 0 ? interests.join('、') : '无特别偏好';
  
  return `请为我规划一次${destination}的旅行：

基本信息：
- 目的地：${destination}
- 出发日期：${startDate}
- 返回日期：${endDate}
- 旅行人数：${travelers}人
- 总预算：${budget}元
- 旅行风格：${travelStyle}

偏好设置：
- 交通偏好：${transportation}
- 住宿偏好：${accommodation}
- 兴趣爱好：${interestsList}
- 详细偏好：${preferences || '无特别要求'}

请生成一个完整详细的旅行行程，包括每日的具体安排、时间规划、费用预算、推荐餐厅、住宿建议等。请确保行程实用性强，时间安排合理，费用控制在预算范围内。`;
}

/**
 * 创建完整的AI提示词模板
 */
export function createPromptTemplate(requirements: AIGenerationRequest): AIPromptTemplate {
  return {
    systemPrompt: createSystemPrompt(),
    userPrompt: createUserPrompt(requirements)
  };
}

/**
 * 验证AI响应格式
 */
export function validateAIResponse(response: string): boolean {
  try {
    const parsed = JSON.parse(response);
    
    // 检查必要字段
    const requiredFields = ['id', 'title', 'destination', 'startDate', 'endDate', 'totalDays', 'days'];
    for (const field of requiredFields) {
      if (!(field in parsed)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }

    // 检查days数组格式
    if (!Array.isArray(parsed.days) || parsed.days.length === 0) {
      console.error('Days array is invalid');
      return false;
    }

    // 检查每日行程格式
    for (const day of parsed.days) {
      if (!day.day || !day.date || !Array.isArray(day.items)) {
        console.error('Invalid day format');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Invalid JSON format:', error);
    return false;
  }
}

/**
 * 清理AI响应文本
 */
export function cleanAIResponse(response: string): string {
  // 移除markdown代码块标记
  let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // 移除可能的前缀文字
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }
  
  return cleaned.trim();
}