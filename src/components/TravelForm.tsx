'use client';

import React, { useState, useEffect } from 'react';
import { 
  TravelRequirements, 
  FormErrors, 
  DEFAULT_FORM_DATA,
  TRAVEL_STYLE_OPTIONS,
  INTEREST_OPTIONS,
  TRANSPORTATION_OPTIONS,
  ACCOMMODATION_OPTIONS
} from '@/types/travel';
import {
  validateTravelForm,
  hasFormErrors,
  getTodayDateString,
  getTomorrowDateString,
  calculateTravelDays,
  formatBudget,
  generateTravelDescription
} from '@/utils/form-validation';
import WebSpeechInput from '@/components/WebSpeechInput';

export interface TravelFormProps {
  onSubmit: (data: TravelRequirements) => void;
  loading?: boolean;
  initialData?: Partial<TravelRequirements>;
}

export default function TravelForm({ 
  onSubmit, 
  loading = false, 
  initialData = {} 
}: TravelFormProps) {
  const [formData, setFormData] = useState<TravelRequirements>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);

  // 初始化默认日期
  useEffect(() => {
    if (!formData.startDate) {
      setFormData(prev => ({
        ...prev,
        startDate: getTodayDateString(),
        endDate: getTomorrowDateString(),
      }));
    }
  }, []);

  // 处理表单字段变化
  const handleChange = (field: keyof TravelRequirements, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // 清除相应字段的错误
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // 处理兴趣标签选择
  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    handleChange('interests', newInterests);
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateTravelForm(formData);
    setErrors(validationErrors);
    
    if (!hasFormErrors(validationErrors)) {
      onSubmit(formData);
    }
  };

  // 计算旅行天数
  const travelDays = calculateTravelDays(formData.startDate, formData.endDate);

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本信息部分 */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center">
            📍 基本信息
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 目的地 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                目的地
              </label>
              <WebSpeechInput
                value={formData.destination}
                onChange={(value) => handleChange('destination', value)}
                placeholder="例如：北京、上海、杭州..."
                className={errors.destination ? 'border-red-500' : ''}
              />
              {errors.destination && (
                <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
              )}
            </div>

            {/* 旅行人数 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                同行人数
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.travelers}
                onChange={(e) => handleChange('travelers', parseInt(e.target.value) || 1)}
                style={{ color: '#111827' }}
                className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:border-gray-400 ${
                  errors.travelers ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                }`}
              />
              {errors.travelers && (
                <p className="mt-1 text-sm text-red-600">{errors.travelers}</p>
              )}
            </div>

            {/* 出发日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                出发日期
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                min={getTodayDateString()}
                style={{ color: '#111827' }}
                className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:border-gray-400 ${
                  errors.startDate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            {/* 返回日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                返程日期
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={formData.startDate || getTodayDateString()}
                style={{ color: '#111827' }}
                className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:border-gray-400 ${
                  errors.endDate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
              {travelDays > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  共 {travelDays} 天行程
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 预算和风格 */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 flex items-center">
            💰 预算与风格
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 预算范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                预算范围 * ({formatBudget(formData.budget)})
              </label>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={formData.budget}
                onChange={(e) => handleChange('budget', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>500元</span>
                <span>5万元</span>
              </div>
              {errors.budget && (
                <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
              )}
            </div>

            {/* 旅行风格 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                旅行风格
              </label>
              <select
                value={formData.travelStyle}
                onChange={(e) => handleChange('travelStyle', e.target.value)}
                style={{ color: '#111827' }}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:border-gray-400"
              >
                {TRAVEL_STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 交通和住宿偏好 */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center">
            🚗 交通与住宿
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 交通方式 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                交通方式偏好
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TRANSPORTATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('transportation', option.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.transportation === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800'
                    }`}
                  >
                    <div className="text-lg">{option.emoji}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 住宿偏好 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                住宿偏好
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ACCOMMODATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('accommodation', option.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.accommodation === option.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800'
                    }`}
                  >
                    <div className="text-lg">{option.emoji}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 兴趣偏好 */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6 flex items-center">
            🎯 兴趣偏好
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {INTEREST_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInterestToggle(option.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.interests.includes(option.value)
                    ? 'border-yellow-500 bg-yellow-100 text-yellow-800'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800'
                }`}
              >
                <div className="text-lg mb-1">{option.emoji}</div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 详细偏好 */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center">
            📝 详细偏好
          </h3>
          
          <WebSpeechInput
            value={formData.preferences}
            onChange={(value) => handleChange('preferences', value)}
            placeholder="详细描述您的旅行偏好，例如：喜欢安静的地方、想体验当地美食、希望有购物时间等..."
            className={errors.preferences ? 'border-red-500' : ''}
          />
          {errors.preferences && (
            <p className="mt-1 text-sm text-red-600">{errors.preferences}</p>
          )}
          
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>💡 支持语音输入，点击麦克风按钮开始说话</span>
            <span>{formData.preferences.length}/500 字符</span>
          </div>
        </div>

        {/* 预览按钮 */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="mb-6 px-6 py-3 text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            {showPreview ? '🔼 隐藏预览' : '👁️ 预览需求'}
          </button>
        </div>

        {/* 需求预览 */}
        {showPreview && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8">
            <h4 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center">
              📋 旅行需求预览
            </h4>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-800 leading-relaxed text-lg">
                {generateTravelDescription(formData)}
              </p>
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={loading}
            className={`px-12 py-4 text-xl font-bold text-white rounded-2xl transition-all duration-300 shadow-xl ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-2xl hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                AI正在规划中...
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-3 text-2xl">🤖</span>
                开始AI规划
                <span className="ml-3 text-2xl">✨</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}