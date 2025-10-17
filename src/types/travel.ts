// 旅行需求相关的类型定义

export interface TravelRequirements {
  destination: string;           // 目的地
  startDate: string;            // 出发日期
  endDate: string;              // 结束日期
  budget: number;               // 预算（元）
  travelers: number;            // 旅行人数
  travelStyle: TravelStyle;     // 旅行风格
  preferences: string;          // 偏好描述
  transportation: string;       // 交通方式
  accommodation: string;        // 住宿偏好
  interests: string[];          // 兴趣标签
}

export enum TravelStyle {
  RELAXED = 'relaxed',         // 休闲
  ADVENTURE = 'adventure',     // 冒险
  CULTURAL = 'cultural',       // 文化
  LUXURY = 'luxury',           // 奢华
  BUDGET = 'budget',           // 经济
  FAMILY = 'family',           // 家庭
  ROMANTIC = 'romantic',       // 浪漫
  BUSINESS = 'business',       // 商务
}

export interface FormErrors {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  travelers?: string;
  preferences?: string;
}

// 旅行兴趣标签选项
export const INTEREST_OPTIONS = [
  { value: 'historical', label: '历史古迹', emoji: '🏛️' },
  { value: 'nature', label: '自然风光', emoji: '🌄' },
  { value: 'food', label: '美食体验', emoji: '🍜' },
  { value: 'shopping', label: '购物娱乐', emoji: '🛍️' },
  { value: 'photography', label: '摄影打卡', emoji: '📸' },
  { value: 'museum', label: '博物馆', emoji: '🏛️' },
  { value: 'nightlife', label: '夜生活', emoji: '🌃' },
  { value: 'sports', label: '运动户外', emoji: '⛷️' },
  { value: 'art', label: '艺术文化', emoji: '🎨' },
  { value: 'beach', label: '海滩度假', emoji: '🏖️' },
  { value: 'temple', label: '宗教寺庙', emoji: '⛩️' },
  { value: 'festival', label: '节庆活动', emoji: '🎪' },
];

// 交通方式选项
export const TRANSPORTATION_OPTIONS = [
  { value: 'plane', label: '飞机', emoji: '✈️' },
  { value: 'train', label: '火车', emoji: '🚄' },
  { value: 'car', label: '自驾', emoji: '🚗' },
  { value: 'bus', label: '大巴', emoji: '🚌' },
  { value: 'mixed', label: '混合交通', emoji: '🚊' },
];

// 住宿偏好选项
export const ACCOMMODATION_OPTIONS = [
  { value: 'hotel', label: '酒店', emoji: '🏨' },
  { value: 'resort', label: '度假村', emoji: '🏖️' },
  { value: 'hostel', label: '青旅', emoji: '🏠' },
  { value: 'bnb', label: '民宿', emoji: '🏡' },
  { value: 'apartment', label: '公寓', emoji: '🏢' },
  { value: 'camping', label: '露营', emoji: '⛺' },
];

// 旅行风格选项
export const TRAVEL_STYLE_OPTIONS = [
  { 
    value: TravelStyle.RELAXED, 
    label: '休闲度假', 
    emoji: '🏖️',
    description: '慢节奏，享受悠闲时光'
  },
  { 
    value: TravelStyle.ADVENTURE, 
    label: '冒险探索', 
    emoji: '🏔️',
    description: '刺激体验，挑战自我'
  },
  { 
    value: TravelStyle.CULTURAL, 
    label: '文化深度', 
    emoji: '🎭',
    description: '深入了解当地文化'
  },
  { 
    value: TravelStyle.LUXURY, 
    label: '奢华享受', 
    emoji: '💎',
    description: '高端体验，品质优先'
  },
  { 
    value: TravelStyle.BUDGET, 
    label: '经济实惠', 
    emoji: '💰',
    description: '控制成本，性价比高'
  },
  { 
    value: TravelStyle.FAMILY, 
    label: '亲子家庭', 
    emoji: '👨‍👩‍👧‍👦',
    description: '适合全家，老少皆宜'
  },
  { 
    value: TravelStyle.ROMANTIC, 
    label: '浪漫蜜月', 
    emoji: '💕',
    description: '情侣专属，浪漫温馨'
  },
  { 
    value: TravelStyle.BUSINESS, 
    label: '商务出行', 
    emoji: '💼',
    description: '高效便捷，商务需求'
  },
];

// 表单验证规则
export const VALIDATION_RULES = {
  destination: {
    required: true,
    minLength: 2,
    message: '请输入有效的目的地（至少2个字符）'
  },
  startDate: {
    required: true,
    message: '请选择出发日期'
  },
  endDate: {
    required: true,
    message: '请选择结束日期'
  },
  budget: {
    required: true,
    min: 100,
    max: 1000000,
    message: '预算范围：100-1,000,000元'
  },
  travelers: {
    required: true,
    min: 1,
    max: 50,
    message: '旅行人数：1-50人'
  },
  preferences: {
    maxLength: 500,
    message: '偏好描述不超过500字符'
  }
};

// 默认表单数据
export const DEFAULT_FORM_DATA: TravelRequirements = {
  destination: '',
  startDate: '',
  endDate: '',
  budget: 3000,
  travelers: 2,
  travelStyle: TravelStyle.RELAXED,
  preferences: '',
  transportation: 'mixed',
  accommodation: 'hotel',
  interests: [],
};