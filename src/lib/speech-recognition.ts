import CryptoJS from 'crypto-js';

// 讯飞语音识别配置接口
export interface IFlytekConfig {
  appId: string;
  apiSecret: string;
  apiKey: string;
}

// 语音识别结果接口
export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

// 错误类型
export class SpeechRecognitionError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SpeechRecognitionError';
  }
}

/**
 * 生成讯飞语音识别WebSocket连接的授权URL
 */
export function generateIFlytekAuthUrl(config: IFlytekConfig): string {
  const { appId, apiSecret, apiKey } = config;
  
  // 生成RFC1123格式的时间戳
  const date = new Date().toUTCString();
  
  // 拼接字符串
  const signatureOrigin = `host: iat-api.xfyun.cn\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
  
  // 进行hmac-sha256进行加密
  const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
  const signature = CryptoJS.enc.Base64.stringify(signatureSha);
  
  // 拼接authorization
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  const authorization = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin));
  
  // 生成url
  const url = `wss://iat-api.xfyun.cn/v2/iat?authorization=${authorization}&date=${encodeURIComponent(date)}&host=iat-api.xfyun.cn`;
  
  return url;
}

/**
 * 创建讯飞语音识别参数
 */
export function createIFlytekParams(config: IFlytekConfig) {
  return {
    common: {
      app_id: config.appId,
    },
    business: {
      language: 'zh_cn', // 中文
      domain: 'iat', // 语音听写
      accent: 'mandarin', // 普通话
      vinfo: 1,
      vad_eos: 10000, // 静音检测时间
      dwa: 'wpgs', // 动态修正
    },
    data: {
      status: 0, // 首次发送
      format: 'audio/L16;rate=16000', // 音频格式
      encoding: 'raw',
      audio: '', // 音频数据
    },
  };
}

/**
 * 解析讯飞语音识别返回结果
 */
export function parseIFlytekResult(data: any): SpeechRecognitionResult | null {
  try {
    if (!data.data || !data.data.result) {
      return null;
    }

    const result = data.data.result;
    let text = '';
    let confidence = 0;
    
    if (result.ws) {
      result.ws.forEach((ws: any) => {
        ws.cw.forEach((cw: any) => {
          text += cw.w;
          if (cw.wp === 'n') { // 正常词汇
            confidence = Math.max(confidence, parseFloat(cw.sc) || 0);
          }
        });
      });
    }

    return {
      text: text.trim(),
      confidence,
      isFinal: data.data.status === 2, // 2表示结束
    };
  } catch (error) {
    console.error('解析讯飞结果错误:', error);
    return null;
  }
}

/**
 * 获取用户媒体设备权限
 */
export async function getUserMedia(): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new SpeechRecognitionError('浏览器不支持语音录制功能');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        sampleSize: 16,
      }
    });
    return stream;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new SpeechRecognitionError('用户拒绝了麦克风权限');
      } else if (error.name === 'NotFoundError') {
        throw new SpeechRecognitionError('未找到可用的音频设备');
      }
    }
    throw new SpeechRecognitionError('获取麦克风权限失败');
  }
}

/**
 * 音频格式转换 - 将音频转换为讯飞所需的格式
 */
export function convertAudioFormat(audioData: Float32Array): ArrayBuffer {
  // 转换为16位PCM格式
  const pcmData = new Int16Array(audioData.length);
  for (let i = 0; i < audioData.length; i++) {
    const sample = Math.max(-1, Math.min(1, audioData[i]));
    pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
  }
  return pcmData.buffer;
}