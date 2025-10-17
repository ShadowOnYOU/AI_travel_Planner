import { NextRequest, NextResponse } from 'next/server';
import { generateItinerary } from '@/lib/bailian-api';
import { AIGenerationRequest, AIGenerationResponse } from '@/types/ai';

export async function POST(request: NextRequest): Promise<NextResponse<AIGenerationResponse>> {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 验证必要字段
    const requiredFields = ['destination', 'startDate', 'endDate', 'budget', 'travelers'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          error: `缺少必要字段: ${field}`
        }, { status: 400 });
      }
    }

    // 构建AI生成请求
    const aiRequest: AIGenerationRequest = {
      destination: body.destination,
      startDate: body.startDate,
      endDate: body.endDate,
      budget: Number(body.budget),
      travelers: Number(body.travelers),
      travelStyle: body.travelStyle || 'relaxed',
      preferences: body.preferences || '',
      transportation: body.transportation || 'mixed',
      accommodation: body.accommodation || 'hotel',
      interests: Array.isArray(body.interests) ? body.interests : []
    };

    console.log('API收到生成请求:', aiRequest);

    // 调用AI生成服务
    const result = await generateItinerary(aiRequest);
    
    console.log('API生成结果:', result);

    // 返回结果
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }

  } catch (error) {
    console.error('API处理错误:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'AI行程生成API',
    endpoint: '/api/generate-itinerary',
    method: 'POST',
    description: '基于用户需求生成个性化旅行行程'
  });
}