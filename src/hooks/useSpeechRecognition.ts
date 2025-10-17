'use client';

import { useState, useRef, useCallback } from 'react';
import {
  IFlytekConfig,
  SpeechRecognitionResult,
  SpeechRecognitionError,
  generateIFlytekAuthUrl,
  createIFlytekParams,
  parseIFlytekResult,
  getUserMedia,
  convertAudioFormat,
} from '../lib/speech-recognition';

export interface UseSpeechRecognitionOptions {
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: SpeechRecognitionError) => void;
  onStart?: () => void;
  onEnd?: () => void;
  autoRestart?: boolean; // 是否自动重启识别
  maxDuration?: number; // 最大录音时长(秒)
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isConnecting: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 讯飞配置
  const config: IFlytekConfig = {
    appId: process.env.NEXT_PUBLIC_IFLYTEK_APP_ID || '',
    apiSecret: process.env.NEXT_PUBLIC_IFLYTEK_API_SECRET || '',
    apiKey: process.env.NEXT_PUBLIC_IFLYTEK_API_KEY || '',
  };

  // 清理资源
  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsListening(false);
    setIsConnecting(false);
  }, []);

  // 发送音频数据
  const sendAudioData = useCallback((audioBuffer: ArrayBuffer, isLast: boolean = false) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const params = createIFlytekParams(config);
    params.data.status = isLast ? 2 : 1; // 0首次，1继续，2结束
    
    // 转换音频数据为base64
    const uint8Array = new Uint8Array(audioBuffer);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    params.data.audio = btoa(binaryString);

    wsRef.current.send(JSON.stringify(params));
  }, [config]);

  // 开始语音识别
  const start = useCallback(async () => {
    if (isListening || isConnecting) {
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // 检查配置
      if (!config.appId || !config.apiSecret || !config.apiKey) {
        throw new SpeechRecognitionError('讯飞语音识别配置不完整');
      }

      // 获取麦克风权限
      const stream = await getUserMedia();
      mediaStreamRef.current = stream;

      // 创建音频上下文
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      
      // 创建音频处理器
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        if (!isListening) return;

        const inputData = event.inputBuffer.getChannelData(0);
        const audioBuffer = convertAudioFormat(inputData);
        sendAudioData(audioBuffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      // 建立WebSocket连接
      const wsUrl = generateIFlytekAuthUrl(config);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('讯飞WebSocket连接成功');
        
        // 发送首次参数
        const params = createIFlytekParams(config);
        ws.send(JSON.stringify(params));
        
        setIsConnecting(false);
        setIsListening(true);
        options.onStart?.();

        // 设置最大录音时长
        if (options.maxDuration) {
          timeoutRef.current = setTimeout(() => {
            stop();
          }, options.maxDuration * 1000);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.code !== 0) {
            throw new SpeechRecognitionError(`讯飞识别错误: ${data.message}`, data.code);
          }

          const result = parseIFlytekResult(data);
          if (result) {
            setTranscript(prev => {
              // 如果是最终结果，追加到已有文本
              if (result.isFinal) {
                return prev + result.text;
              }
              // 如果是临时结果，替换最后一句
              const lines = prev.split('\n');
              lines[lines.length - 1] = result.text;
              return lines.join('\n');
            });
            
            setConfidence(result.confidence);
            options.onResult?.(result);

            // 如果是最终结果且开启了自动重启
            if (result.isFinal && options.autoRestart && isListening) {
              // 短暂延迟后重新开始
              setTimeout(() => {
                if (isListening) {
                  const params = createIFlytekParams(config);
                  params.data.status = 0; // 重新开始
                  ws.send(JSON.stringify(params));
                }
              }, 100);
            }
          }
        } catch (err) {
          console.error('处理识别结果错误:', err);
        }
      };

      ws.onerror = (event) => {
        const errorMsg = '讯飞WebSocket连接错误';
        setError(errorMsg);
        options.onError?.(new SpeechRecognitionError(errorMsg));
        cleanup();
      };

      ws.onclose = () => {
        console.log('讯飞WebSocket连接关闭');
        setIsListening(false);
        setIsConnecting(false);
        options.onEnd?.();
      };

    } catch (err) {
      const error = err instanceof SpeechRecognitionError ? err : new SpeechRecognitionError('启动语音识别失败');
      setError(error.message);
      setIsConnecting(false);
      options.onError?.(error);
      cleanup();
    }
  }, [isListening, isConnecting, config, options, sendAudioData, cleanup]);

  // 停止语音识别
  const stop = useCallback(() => {
    if (!isListening) return;

    // 发送结束信号
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const params = createIFlytekParams(config);
      params.data.status = 2; // 结束
      params.data.audio = '';
      wsRef.current.send(JSON.stringify(params));
    }

    cleanup();
  }, [isListening, config, cleanup]);

  // 重置状态
  const reset = useCallback(() => {
    stop();
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, [stop]);

  return {
    isListening,
    isConnecting,
    transcript,
    confidence,
    error,
    start,
    stop,
    reset,
  };
}