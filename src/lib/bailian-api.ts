import { BailianConfig, BailianRequest, BailianResponse, AIGenerationRequest, AIGenerationResponse, TravelItinerary, DayItinerary, ItineraryItem } from '@/types/ai';
import { createPromptTemplate, validateAIResponse, cleanAIResponse } from '@/utils/ai-prompts';

/**
 * 阿里云百炼平台API配置
 */
const BAILIAN_CONFIG: BailianConfig = {
  apiKey: process.env.NEXT_PUBLIC_BAILIAN_API_KEY || '',
  baseUrl: process.env.NEXT_PUBLIC_BAILIAN_BASE_URL || 'https://dashscope.aliyuncs.com/api/v1',
  modelId: process.env.NEXT_PUBLIC_BAILIAN_MODEL_ID || 'qwen-turbo'
};

/**
 * 检查API配置是否完整
 */
export function isBailianConfigured(): boolean {
  return !!(BAILIAN_CONFIG.apiKey && BAILIAN_CONFIG.baseUrl && BAILIAN_CONFIG.modelId);
}

/**
 * 调用阿里云百炼API
 */
async function callBailianAPI(request: BailianRequest): Promise<BailianResponse> {
  if (!isBailianConfigured()) {
    throw new Error('阿里云百炼平台API未正确配置，请检查环境变量');
  }

  const response = await fetch(`${BAILIAN_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BAILIAN_CONFIG.apiKey}`,
      'X-DashScope-SSE': 'disable'
    },
    body: JSON.stringify({
      ...request,
      model: BAILIAN_CONFIG.modelId
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Bailian API Error:', response.status, errorText);
    throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.choices || result.choices.length === 0) {
    throw new Error('API返回数据格式错误');
  }

  return result;
}

/**
 * 生成旅行行程
 */
export async function generateTravelItinerary(requirements: AIGenerationRequest): Promise<AIGenerationResponse> {
  try {
    console.log('开始生成旅行行程:', requirements);

    // 创建提示词
    const prompts = createPromptTemplate(requirements);
    
    // 构建API请求
    const bailianRequest: BailianRequest = {
      model: BAILIAN_CONFIG.modelId,
      messages: [
        {
          role: 'system',
          content: prompts.systemPrompt
        },
        {
          role: 'user', 
          content: prompts.userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    };

    // 调用API
    const response = await callBailianAPI(bailianRequest);
    const content = response.choices[0].message.content;
    
    console.log('API原始响应:', content);

    // 清理和验证响应
    const cleanedContent = cleanAIResponse(content);
    
    if (!validateAIResponse(cleanedContent)) {
      throw new Error('AI返回的行程格式不正确');
    }

    // 解析JSON
    const itinerary: TravelItinerary = JSON.parse(cleanedContent);
    
    // 补充缺失字段
    itinerary.id = itinerary.id || `itinerary_${Date.now()}`;
    itinerary.createdAt = itinerary.createdAt || new Date().toISOString();
    
    console.log('生成的行程数据:', itinerary);

    return {
      success: true,
      data: itinerary,
      message: '行程生成成功'
    };

  } catch (error) {
    console.error('生成行程失败:', error);
    
    let errorMessage = '生成行程失败，请重试';
    
    if (error instanceof Error) {
      if (error.message.includes('API未正确配置')) {
        errorMessage = '系统配置错误，请联系管理员';
      } else if (error.message.includes('API请求失败')) {
        errorMessage = 'AI服务暂时不可用，请稍后重试';
      } else if (error.message.includes('格式不正确')) {
        errorMessage = 'AI生成的行程格式有误，请重新生成';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * 模拟生成行程（用于开发测试）
 */
export async function generateMockItinerary(requirements: AIGenerationRequest): Promise<AIGenerationResponse> {
  console.log('使用模拟数据生成行程:', requirements);
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const totalDays = Math.ceil((new Date(requirements.endDate).getTime() - new Date(requirements.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const dailyBudget = Math.round(requirements.budget / totalDays);
  
  // 生成多天行程
  const days: DayItinerary[] = [];
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(requirements.startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    days.push({
      day: i + 1,
      date: currentDate.toISOString().split('T')[0],
      totalCost: dailyBudget + Math.round((Math.random() - 0.5) * dailyBudget * 0.3),
      summary: i === 0 
        ? `抵达${requirements.destination}，入住酒店，适应环境` 
        : i === totalDays - 1 
          ? `最后一天购物，准备返程`
          : `第${i + 1}天深度游览${requirements.destination}`,
      items: generateDayItems(i + 1, requirements, dailyBudget)
    });
  }
  
  const mockItinerary: TravelItinerary = {
    id: `itinerary_${Date.now()}`,
    title: `${requirements.destination}${totalDays}日深度游`,
    destination: requirements.destination,
    startDate: requirements.startDate,
    endDate: requirements.endDate,
    totalDays,
    totalBudget: requirements.budget,
    actualCost: days.reduce((sum, day) => sum + day.totalCost, 0),
    travelers: requirements.travelers,
    travelStyle: requirements.travelStyle,
    days,
    summary: `这是一份为${requirements.travelers}人定制的${requirements.destination} ${totalDays}天旅行行程。根据您选择的"${requirements.travelStyle}"风格，我们精心安排了丰富多样的活动。行程涵盖了当地的特色景点、美食体验和文化活动，总预算控制在${requirements.budget}元以内。`,
    recommendations: [
      '建议提前下载离线地图，避免网络问题',
      `${requirements.destination}的最佳游览时间是上午和傍晚`,
      '随身携带防晒用品和雨具',
      '提前预订热门餐厅和景点门票',
      '学习一些当地的基本用语会很有帮助',
      '购买当地手机卡或开通国际漫游',
      '准备现金，部分商家可能不支持移动支付'
    ],
    createdAt: new Date().toISOString()
  };

  return {
    success: true,
    data: mockItinerary,
    message: '行程生成成功！基于您的偏好为您定制了专属旅行计划。'
  };
}

/**
 * 生成一天的行程项目
 */
function generateDayItems(day: number, requirements: AIGenerationRequest, dailyBudget: number): ItineraryItem[] {
  const currentDate = new Date(requirements.startDate);
  currentDate.setDate(currentDate.getDate() + day - 1);
  const dateStr = currentDate.toISOString().split('T')[0];
  
  const baseItems: ItineraryItem[] = [
    {
      id: `item_${day}_1`,
      day,
      time: '08:00',
      title: '酒店早餐',
      description: '在酒店享用丰盛的早餐，为一天的行程做好准备',
      location: '入住酒店餐厅',
      type: 'restaurant',
      duration: 60,
      cost: Math.round(dailyBudget * 0.1),
      notes: '建议选择当地特色早餐'
    },
    {
      id: `item_${day}_2`,
      day,
      time: '09:30',
      title: `${requirements.destination}标志性景点`,
      description: `游览${requirements.destination}最具代表性的景点，感受当地文化魅力`,
      location: `${requirements.destination}市中心`,
      type: 'attraction',
      duration: 180,
      cost: Math.round(dailyBudget * 0.25),
      notes: '建议穿舒适的步行鞋，带好相机'
    },
    {
      id: `item_${day}_3`,
      day,
      time: '13:00',
      title: '当地特色午餐',
      description: '品尝地道的当地美食，体验独特的饮食文化',
      location: '推荐餐厅',
      type: 'restaurant',
      duration: 90,
      cost: Math.round(dailyBudget * 0.2),
      notes: '可以尝试当地招牌菜和特色小食'
    },
    {
      id: `item_${day}_4`,
      day,
      time: '15:00',
      title: requirements.interests.includes('shopping') ? '购物休闲' : '文化体验',
      description: requirements.interests.includes('shopping') 
        ? '在当地知名商圈购买纪念品和特产'
        : '参观博物馆或文化景点，深入了解当地历史',
      location: requirements.interests.includes('shopping') ? '商业街' : '文化景区',
      type: requirements.interests.includes('shopping') ? 'activity' : 'attraction',
      duration: 120,
      cost: Math.round(dailyBudget * 0.15),
      notes: requirements.interests.includes('shopping') ? '记得比价和砍价' : '可以请导游讲解历史背景'
    },
    {
      id: `item_${day}_5`,
      day,
      time: '18:30',
      title: '特色晚餐',
      description: requirements.interests.includes('nightlife') 
        ? '在热闹的夜市或酒吧街享用晚餐'
        : '在温馨的餐厅享用精致晚餐',
      location: requirements.interests.includes('nightlife') ? '夜市/酒吧街' : '精致餐厅',
      type: 'restaurant',
      duration: 120,
      cost: Math.round(dailyBudget * 0.25),
      notes: requirements.interests.includes('nightlife') ? '体验当地夜生活文化' : '享受安静的用餐环境'
    }
  ];

  return baseItems;
}

/**
 * 根据配置选择使用真实API还是模拟数据
 */
export async function generateItinerary(requirements: AIGenerationRequest): Promise<AIGenerationResponse> {
  console.log('检查百炼API配置状态:', {
    hasApiKey: !!BAILIAN_CONFIG.apiKey && BAILIAN_CONFIG.apiKey !== '',
    baseUrl: BAILIAN_CONFIG.baseUrl,
    modelId: BAILIAN_CONFIG.modelId
  });
  
  if (isBailianConfigured()) {
    console.log('使用阿里云百炼真实API生成行程');
    try {
      return await generateTravelItinerary(requirements);
    } catch (error) {
      console.error('真实API调用失败，降级到模拟数据:', error);
      return await generateMockItinerary(requirements);
    }
  } else {
    console.warn('阿里云百炼API未配置，使用模拟数据');
    return await generateMockItinerary(requirements);
  }
}