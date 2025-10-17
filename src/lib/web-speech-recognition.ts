// Web Speech API 语音识别工具函数

export interface WebSpeechRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface WebSpeechRecognitionOptions {
  language?: string; // 识别语言
  continuous?: boolean; // 是否连续识别
  interimResults?: boolean; // 是否返回临时结果
  maxAlternatives?: number; // 最大候选数
}

export class WebSpeechRecognitionError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'WebSpeechRecognitionError';
  }
}

/**
 * 检查浏览器是否支持语音识别
 */
export function isSpeechRecognitionSupported(): boolean {
  return !!(
    (window as any).SpeechRecognition || 
    (window as any).webkitSpeechRecognition
  );
}

/**
 * 创建语音识别实例
 */
export function createSpeechRecognition(
  options: WebSpeechRecognitionOptions = {}
): any | null {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition = 
    (window as any).SpeechRecognition || 
    (window as any).webkitSpeechRecognition;

  const recognition = new SpeechRecognition();

  // 配置选项
  recognition.lang = options.language || 'zh-CN'; // 中文
  recognition.continuous = options.continuous ?? false; // 默认不连续
  recognition.interimResults = options.interimResults ?? true; // 显示临时结果
  recognition.maxAlternatives = options.maxAlternatives || 1;

  return recognition;
}

/**
 * 解析语音识别结果
 */
export function parseSpeechRecognitionResult(
  event: any
): WebSpeechRecognitionResult[] {
  const results: WebSpeechRecognitionResult[] = [];

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i];
    
    if (result.length > 0) {
      const alternative = result[0];
      results.push({
        text: alternative.transcript,
        confidence: alternative.confidence || 0,
        isFinal: result.isFinal,
      });
    }
  }

  return results;
}

/**
 * 获取语音识别错误信息
 */
export function getSpeechRecognitionErrorMessage(error: any): string {
  switch (error.error) {
    case 'no-speech':
      return '没有检测到语音输入，请重试';
    case 'audio-capture':
      return '无法访问麦克风，请检查麦克风权限';
    case 'not-allowed':
      return '麦克风权限被拒绝，请在浏览器设置中允许麦克风访问';
    case 'network':
      return '网络连接错误，请检查网络设置';
    case 'language-not-supported':
      return '不支持当前语言设置';
    case 'service-not-allowed':
      return '语音识别服务不可用';
    default:
      return `语音识别错误: ${error.error}`;
  }
}