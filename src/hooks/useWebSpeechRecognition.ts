'use client';

import { useState, useRef, useCallback } from 'react';
import {
  WebSpeechRecognitionResult,
  WebSpeechRecognitionError,
  WebSpeechRecognitionOptions,
  isSpeechRecognitionSupported,
  createSpeechRecognition,
  parseSpeechRecognitionResult,
  getSpeechRecognitionErrorMessage,
} from '../lib/web-speech-recognition';

export interface UseWebSpeechRecognitionOptions extends WebSpeechRecognitionOptions {
  onResult?: (result: WebSpeechRecognitionResult) => void;
  onError?: (error: WebSpeechRecognitionError) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface UseWebSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useWebSpeechRecognition(
  options: UseWebSpeechRecognitionOptions = {}
): UseWebSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isSupported = isSpeechRecognitionSupported();

  // 初始化语音识别
  const initRecognition = useCallback(() => {
    if (!isSupported) {
      return null;
    }

    const recognition = createSpeechRecognition({
      language: 'zh-CN',
      continuous: false,
      interimResults: true,
      maxAlternatives: 1,
      ...options,
    });

    if (!recognition) {
      return null;
    }

    // 识别开始
    recognition.onstart = () => {
      console.log('语音识别开始');
      setIsListening(true);
      setError(null);
      options.onStart?.();
    };

    // 识别结果
    recognition.onresult = (event: any) => {
      console.log('收到识别结果:', event);
      
      const results = parseSpeechRecognitionResult(event);
      
      if (results.length > 0) {
        const latestResult = results[results.length - 1];
        
        // 更新文本和置信度
        setTranscript(latestResult.text);
        setConfidence(latestResult.confidence);
        
        // 触发回调
        options.onResult?.(latestResult);
        
        console.log('识别文本:', latestResult.text, '置信度:', latestResult.confidence);
      }
    };

    // 识别错误
    recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error);
      const errorMessage = getSpeechRecognitionErrorMessage(event);
      setError(errorMessage);
      setIsListening(false);
      options.onError?.(new WebSpeechRecognitionError(errorMessage, event.error));
    };

    // 识别结束
    recognition.onend = () => {
      console.log('语音识别结束');
      setIsListening(false);
      options.onEnd?.();
    };

    return recognition;
  }, [isSupported, options]);

  // 开始识别
  const start = useCallback(() => {
    if (!isSupported) {
      setError('当前浏览器不支持语音识别功能');
      return;
    }

    if (isListening) {
      return;
    }

    try {
      const recognition = initRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
      } else {
        setError('无法初始化语音识别');
      }
    } catch (err) {
      console.error('启动语音识别失败:', err);
      setError('启动语音识别失败');
    }
  }, [isSupported, isListening, initRecognition]);

  // 停止识别
  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // 重置状态
  const reset = useCallback(() => {
    stop();
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, [stop]);

  return {
    isSupported,
    isListening,
    transcript,
    confidence,
    error,
    start,
    stop,
    reset,
  };
}