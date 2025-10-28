import { TravelRequirements } from '@/types/travel';
import { AIPromptTemplate, AIGenerationRequest } from '@/types/ai';

/**
 * 生成旅行规划的系统提示词
 */
export function createSystemPrompt(): string {
  return `你是一个专业的AI旅行规划师，具有丰富的旅行规划经验和全球各地的深度当地知识。你必须基于真实存在的景点、餐厅、酒店来制定行程，确保推荐的地点都是真实可访问的。

关键要求：
1. 必须推荐真实存在的具体景点名称（如"故宫博物院"而不是"当地著名景点"）
2. 必须推荐真实的餐厅和酒店名称，包含具体地址信息
3. 时间安排要现实合理，考虑排队、交通、用餐等实际耗时
4. 费用预算要基于当前真实价格水平
5. 考虑季节、天气、营业时间等实际因素

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

具体规划要求：
1. 必须使用真实景点名称和准确地址（如"北京故宫博物院，东城区景山前街4号"）
2. 必须推荐真实存在的餐厅（如"全聚德烤鸭店（前门店），前门大街30号"）
3. 必须推荐真实的酒店（如"北京饭店，东城区东长安街33号"）
4. 行程安排要现实合理，考虑实际的排队时间、交通时间、景点开放时间
5. 预算要基于真实价格：门票、餐饮、交通、住宿的当前市场价格
6. 根据用户兴趣偏好精准匹配景点类型
7. 考虑目的地的实际天气、季节、节假日等因素
8. 时间安排要人性化，避免过于紧凑，包含适当休息时间
9. 餐饮要突出当地特色，包含不同价位选择
10. 交通方式要实用（地铁、公交、出租车、步行等具体建议）
11. 提供实用的当地文化、习俗、注意事项
12. 费用估算要准确反映当前物价水平`;
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
  const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  const dailyBudget = Math.round(budget / totalDays);
  
  // 根据旅行风格提供更多上下文
  const styleDescriptions = {
    relaxed: '休闲舒适，注重体验品质，避免行程过于紧凑',
    adventure: '喜欢刺激和挑战，偏好户外活动和探险体验',
    cultural: '深度文化体验，重点关注历史、艺术、传统文化',
    luxury: '高端奢华体验，注重服务品质和独特性',
    budget: '经济实惠，注重性价比，控制成本',
    family: '适合全家出行，老少皆宜，安全舒适',
    romantic: '浪漫温馨，适合情侣，注重氛围和私密性',
    business: '高效便捷，适合商务出行，注重交通便利性'
  };
  
  return `请为我规划一次${destination}的深度旅行：

【基本信息】
- 目的地：${destination}
- 出发日期：${startDate}
- 返回日期：${endDate}（共${totalDays}天）
- 旅行人数：${travelers}人
- 总预算：${budget}元（日均约${dailyBudget}元）
- 旅行风格：${travelStyle}（${styleDescriptions[travelStyle as keyof typeof styleDescriptions] || ''}）

【偏好设置】
- 交通偏好：${transportation}
- 住宿偏好：${accommodation}
- 兴趣爱好：${interestsList}
- 特殊要求：${preferences || '无特别要求'}

【重要要求】
请基于真实存在的景点、餐厅、酒店制定行程。必须包含：
1. 每个景点的具体名称和详细地址
2. 真实餐厅名称、招牌菜、价格范围
3. 推荐酒店的具体名称、位置、价位
4. 实际的交通方式和预估时间
5. 真实的门票价格和开放时间
6. 基于当前物价的准确费用预算
7. 实用的当地文化和注意事项

请确保推荐的所有地点都是真实存在且当前可以访问的，行程时间安排要现实可行。`;
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