'use client';

import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export interface SpeechInputProps {
  value?: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDuration?: number; // 最大录音时长(秒)
  autoRestart?: boolean; // 是否自动重启识别
}

export default function SpeechInput({
  value = '',
  onChange,
  placeholder = '点击麦克风开始语音输入...',
  className = '',
  disabled = false,
  maxDuration = 60,
  autoRestart = false,
}: SpeechInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const {
    isListening,
    isConnecting,
    transcript,
    confidence,
    error,
    start,
    stop,
    reset,
  } = useSpeechRecognition({
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
    autoRestart,
    maxDuration,
  });

  // 同步外部value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 同步语音识别结果
  useEffect(() => {
    if (transcript) {
      const newValue = transcript;
      setInputValue(newValue);
      onChange?.(newValue);
    }
  }, [transcript, onChange]);

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
      {/* 文本输入区域 */}
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full min-h-[120px] p-4 pr-24 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          resize-none
          ${error ? 'border-red-500' : ''}
        `}
      />

      {/* 控制按钮组 */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {/* 录音按钮 */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled || isConnecting}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            transition-all duration-200 shadow-sm
            ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : isConnecting
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title={
            isListening
              ? '点击停止录音'
              : isConnecting
              ? '正在连接...'
              : '点击开始语音输入'
          }
        >
          {isConnecting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isListening ? (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a4 4 0 00-4 4v4a4 4 0 008 0V6a4 4 0 00-4-4z" />
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zM15 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM10 15a5 5 0 01-5-5H3a7 7 0 0014 0h-2a5 5 0 01-5 5z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
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
              w-10 h-10 rounded-full flex items-center justify-center
              bg-gray-500 hover:bg-gray-600 text-white
              transition-all duration-200 shadow-sm
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title="清除内容"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
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
          
          {isConnecting && (
            <div className="flex items-center text-yellow-600">
              <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse mr-1" />
              连接中...
            </div>
          )}

          {confidence > 0 && !isListening && (
            <div className="text-green-600">
              识别置信度: {(confidence * 100).toFixed(0)}%
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
      {!inputValue && !isListening && !isConnecting && (
        <div className="mt-2 text-xs text-gray-400">
          💡 支持文字输入和语音输入，点击麦克风按钮开始语音识别
        </div>
      )}
    </div>
  );
}