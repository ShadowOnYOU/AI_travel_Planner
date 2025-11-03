'use client';

import React, { useState, useEffect } from 'react';
import { useWebSpeechRecognition } from '../hooks/useWebSpeechRecognition';

export interface WebSpeechInputProps {
  value?: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  continuous?: boolean; // 是否连续识别
}

export default function WebSpeechInput({
  value = '',
  onChange,
  placeholder = '点击麦克风开始语音输入...',
  className = '',
  disabled = false,
  continuous = false,
}: WebSpeechInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const {
    isSupported,
    isListening,
    transcript,
    confidence,
    error,
    start,
    stop,
    reset,
  } = useWebSpeechRecognition({
    continuous,
    onResult: (result) => {
      console.log('语音识别结果:', result);
    },
    onError: (error) => {
      console.error('语音识别错误:', error);
    },
    onStart: () => {
      console.log('语音识别开始');
    },
    onEnd: () => {
      console.log('语音识别结束');
    },
  });

  // 同步外部value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 同步语音识别结果
  useEffect(() => {
    if (transcript) {
      const newValue = continuous ? 
        inputValue + (inputValue ? ' ' : '') + transcript : // 连续模式追加
        transcript; // 单次模式替换
      
      setInputValue(newValue);
      onChange?.(newValue);
    }
  }, [transcript, continuous, inputValue, onChange]);

  // 处理文本输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  // 切换录音状态
  const toggleRecording = () => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  // 清除内容
  const clearContent = () => {
    setInputValue('');
    onChange?.('');
    reset();
  };

  return (
    <div className={`relative ${className}`}>
      {/* 浏览器兼容性提示 */}
      {!isSupported && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">当前浏览器不支持语音识别</span>
          </div>
          <p className="mt-1 text-sm text-yellow-700">
            推荐使用 Chrome、Safari 或 Edge 浏览器
          </p>
        </div>
      )}

      {/* 文本输入区域 */}
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full min-h-[120px] p-4 pr-24 border-2 border-gray-200 rounded-xl
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm
          transition-all duration-200 hover:border-gray-400
          disabled:bg-gray-100 disabled:cursor-not-allowed
          resize-none
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
        `}
      />

      {/* 控制按钮组 */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {/* 录音按钮 */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled || !isSupported}
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5
            ${
              isListening
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
            }
            ${disabled || !isSupported ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title={
            !isSupported
              ? '浏览器不支持语音识别'
              : isListening
              ? '点击停止录音'
              : '点击开始语音输入'
          }
        >
          {isListening ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* 清除按钮 */}
        {inputValue && (
          <button
            type="button"
            onClick={clearContent}
            disabled={disabled}
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white
              transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title="清除内容"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 状态指示器 */}
      <div className="mt-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {isListening && (
            <div className="flex items-center text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-1" />
              正在录音...
            </div>
          )}

          {confidence > 0 && !isListening && (
            <div className="text-green-600">
              识别置信度: {(confidence * 100).toFixed(0)}%
            </div>
          )}

          {!isSupported && (
            <div className="text-orange-600">
              ⚠️ 不支持语音识别
            </div>
          )}
        </div>

        <div className="text-gray-500">
          {inputValue.length} 字符
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      {!inputValue && !isListening && !error && (
        <div className="mt-2 text-xs text-gray-400">
          💡 支持文字输入和语音输入{isSupported && '，点击麦克风按钮开始语音识别'}
        </div>
      )}
    </div>
  );
}