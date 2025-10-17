// AI相关的类型定义和接口

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  title: string;
  description: string;
  location: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'activity';
  duration: number; // 分钟
  cost: number;
  notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DayItinerary {
  day: number;
  date: string;
  totalCost: number;
  items: ItineraryItem[];
  summary: string;
}

export interface TravelItinerary {
  id: string;
  userId?: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalBudget: number;
  actualCost: number;
  travelers: number;
  travelStyle: string;
  days: DayItinerary[];
  summary: string;
  recommendations: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface AIGenerationRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  travelStyle: string;
  preferences: string;
  transportation: string;
  accommodation: string;
  interests: string[];
}

export interface AIGenerationResponse {
  success: boolean;
  data?: TravelItinerary;
  error?: string;
  message?: string;
}

export interface AIPromptTemplate {
  systemPrompt: string;
  userPrompt: string;
}

// 阿里云百炼API配置
export interface BailianConfig {
  apiKey: string;
  baseUrl: string;
  modelId: string;
}

// API请求和响应格式
export interface BailianRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface BailianResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}