import { TravelRequirements, FormErrors, VALIDATION_RULES } from '../types/travel';

/**
 * 验证旅行需求表单
 */
export function validateTravelForm(data: TravelRequirements): FormErrors {
  const errors: FormErrors = {};

  // 验证目的地
  if (!data.destination || data.destination.trim().length < VALIDATION_RULES.destination.minLength) {
    errors.destination = VALIDATION_RULES.destination.message;
  }

  // 验证开始日期
  if (!data.startDate) {
    errors.startDate = VALIDATION_RULES.startDate.message;
  }

  // 验证结束日期
  if (!data.endDate) {
    errors.endDate = VALIDATION_RULES.endDate.message;
  } else if (data.startDate && new Date(data.endDate) <= new Date(data.startDate)) {
    errors.endDate = '结束日期必须晚于开始日期';
  }

  // 验证预算
  if (!data.budget || data.budget < VALIDATION_RULES.budget.min || data.budget > VALIDATION_RULES.budget.max) {
    errors.budget = VALIDATION_RULES.budget.message;
  }

  // 验证旅行人数
  if (!data.travelers || data.travelers < VALIDATION_RULES.travelers.min || data.travelers > VALIDATION_RULES.travelers.max) {
    errors.travelers = VALIDATION_RULES.travelers.message;
  }

  // 验证偏好描述长度
  if (data.preferences && data.preferences.length > VALIDATION_RULES.preferences.maxLength!) {
    errors.preferences = VALIDATION_RULES.preferences.message;
  }

  return errors;
}

/**
 * 检查表单是否有错误
 */
export function hasFormErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 获取今天的日期字符串
 */
export function getTodayDateString(): string {
  return formatDateForInput(new Date());
}

/**
 * 获取明天的日期字符串
 */
export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateForInput(tomorrow);
}

/**
 * 计算旅行天数
 */
export function calculateTravelDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * 格式化预算显示
 */
export function formatBudget(budget: number): string {
  if (budget >= 10000) {
    return `${(budget / 10000).toFixed(1)}万元`;
  }
  return `${budget}元`;
}

/**
 * 生成旅行需求的文本描述
 */
export function generateTravelDescription(data: TravelRequirements): string {
  const days = calculateTravelDays(data.startDate, data.endDate);
  const budget = formatBudget(data.budget);
  
  let description = `${data.travelers}人${days}天${data.destination}之旅，预算${budget}`;
  
  if (data.preferences) {
    description += `。旅行偏好：${data.preferences}`;
  }
  
  if (data.interests.length > 0) {
    description += `。感兴趣的活动：${data.interests.join('、')}`;
  }
  
  return description;
}