/**
 * GPT Service - OpenAI API Integration
 * IT 교육 콘텐츠 생성을 위한 GPT 서비스
 */

import OpenAI from 'openai';
import { CostMonitor } from '@infographai/cost-monitor';
import winston from 'winston';

// GPT 모델 설정
export enum GPTModel {
  GPT4 = 'gpt-4-turbo-preview',
  GPT35 = 'gpt-3.5-turbo',
  GPT4_VISION = 'gpt-4-vision-preview'
}

// 모델별 비용 (1000 토큰당)
const MODEL_COSTS = {
  [GPTModel.GPT4]: { input: 0.01, output: 0.03 },
  [GPTModel.GPT35]: { input: 0.0005, output: 0.0015 },
  [GPTModel.GPT4_VISION]: { input: 0.01, output: 0.03 }
};

// 스크립트 생성 옵션
export interface ScriptOptions {
  topic: string;
  duration: number; // seconds
  targetAudience: 'beginner' | 'intermediate' | 'advanced';
  language: 'ko' | 'en';
  style?: 'casual' | 'formal' | 'educational';
  keywords?: string[];
}

// 생성된 스크립트
export interface GeneratedScript {
  title: string;
  introduction: string;
  sections: ScriptSection[];
  conclusion: string;
  estimatedDuration: number;
  keywords: string[];
  metadata: {
    tokens: number;
    model: string;
    cost: number;
  };
}

export interface ScriptSection {
  title: string;
  content: string;
  duration: number;
  visualSuggestions: string[];
  codeExamples?: string[];
}

// 인포그래픽 설명 생성
export interface InfographicPrompt {
  concept: string;
  style: 'diagram' | 'flowchart' | 'comparison' | 'timeline' | 'process';
  complexity: 'simple' | 'moderate' | 'detailed';
}

export interface InfographicDescription {
  title: string;
  description: string;
  elements: InfographicElement[];
  colorScheme: string[];
  layout: string;
}

export interface InfographicElement {
  type: 'text' | 'shape' | 'icon' | 'arrow' | 'chart';
  content: string;
  position: { x: number; y: number };
  style: Record<string, any>;
}

export class GPTService {
  private openai: OpenAI;
  private logger: winston.Logger;
  private costMonitor: CostMonitor | null = null;
  private defaultModel: GPTModel = GPTModel.GPT35;

  constructor(apiKey?: string, costMonitor?: CostMonitor) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OpenAI API key is required');
    }

    this.openai = new OpenAI({ apiKey: key });
    this.costMonitor = costMonitor || null;

    // Logger 설정
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'gpt-service.log' })
      ]
    });
  }

  /**
   * IT 교육 스크립트 생성
   */
  public async generateScript(options: ScriptOptions): Promise<GeneratedScript> {
    const { topic, duration, targetAudience, language, style = 'educational', keywords = [] } = options;

    // 섹션 수 계산 (30초당 1섹션)
    const sectionCount = Math.max(3, Math.floor(duration / 30));

    const systemPrompt = `You are an expert IT education content creator specializing in creating engaging, informative scripts for educational videos. 
    Create content that is accurate, practical, and appropriate for the target audience level.
    Language: ${language === 'ko' ? 'Korean' : 'English'}
    Style: ${style}`;

    const userPrompt = `Create a detailed educational video script about "${topic}" for ${targetAudience} level audience.
    
    Requirements:
    - Total duration: ${duration} seconds
    - Number of sections: ${sectionCount}
    - Include practical examples and code snippets where relevant
    - Suggest visual elements for each section
    - Keywords to emphasize: ${keywords.join(', ')}
    
    Format the response as JSON with the following structure:
    {
      "title": "Video title",
      "introduction": "Opening statement (10-15 seconds)",
      "sections": [
        {
          "title": "Section title",
          "content": "Detailed content for this section",
          "duration": seconds,
          "visualSuggestions": ["visual element 1", "visual element 2"],
          "codeExamples": ["code example if applicable"]
        }
      ],
      "conclusion": "Closing statement (10-15 seconds)",
      "keywords": ["key", "words"]
    }`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from GPT');
      }

      const script = JSON.parse(response) as Omit<GeneratedScript, 'estimatedDuration' | 'metadata'>;
      const tokens = completion.usage?.total_tokens || 0;
      const cost = this.calculateCost(this.defaultModel, tokens);

      // 비용 추적
      if (this.costMonitor) {
        await this.costMonitor.addCost({
          service: 'gpt3.5',
          amount: cost,
          timestamp: new Date(),
          metadata: { operation: 'generateScript', topic }
        });
      }

      this.logger.info('Script generated', { topic, tokens, cost });

      return {
        ...script,
        estimatedDuration: duration,
        metadata: {
          tokens,
          model: this.defaultModel,
          cost
        }
      };
    } catch (error) {
      this.logger.error('Failed to generate script', { error, topic });
      throw error;
    }
  }

  /**
   * 인포그래픽 설명 생성
   */
  public async generateInfographicDescription(
    prompt: InfographicPrompt
  ): Promise<InfographicDescription> {
    const { concept, style, complexity } = prompt;

    const systemPrompt = `You are an expert infographic designer. Create detailed descriptions for infographic elements that clearly visualize IT concepts.
    Focus on clarity, visual hierarchy, and educational value.`;

    const userPrompt = `Create a detailed infographic design for the concept: "${concept}"
    
    Style: ${style}
    Complexity: ${complexity}
    
    Provide a JSON response with:
    - Title and description
    - Detailed elements with positions (x, y as percentages 0-100)
    - Color scheme (hex colors)
    - Layout description
    
    Format:
    {
      "title": "Infographic title",
      "description": "Brief description",
      "elements": [
        {
          "type": "text|shape|icon|arrow|chart",
          "content": "Element content/text",
          "position": {"x": 50, "y": 50},
          "style": {"fontSize": "16px", "color": "#333"}
        }
      ],
      "colorScheme": ["#primary", "#secondary", "#accent"],
      "layout": "Layout description"
    }`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from GPT');
      }

      const infographic = JSON.parse(response) as InfographicDescription;
      const tokens = completion.usage?.total_tokens || 0;
      const cost = this.calculateCost(this.defaultModel, tokens);

      // 비용 추적
      if (this.costMonitor) {
        await this.costMonitor.addCost({
          service: 'gpt3.5',
          amount: cost,
          timestamp: new Date(),
          metadata: { operation: 'generateInfographic', concept }
        });
      }

      this.logger.info('Infographic description generated', { concept, tokens, cost });

      return infographic;
    } catch (error) {
      this.logger.error('Failed to generate infographic', { error, concept });
      throw error;
    }
  }

  /**
   * 코드 예제 생성
   */
  public async generateCodeExample(
    language: string,
    concept: string,
    level: 'basic' | 'intermediate' | 'advanced'
  ): Promise<string> {
    const prompt = `Generate a ${level} level ${language} code example demonstrating "${concept}".
    Include:
    - Clear comments explaining each part
    - Best practices
    - Common pitfalls to avoid
    
    Make it educational and practical.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: 'You are an expert programmer and educator.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1000
      });

      const code = completion.choices[0].message.content || '';
      const tokens = completion.usage?.total_tokens || 0;
      const cost = this.calculateCost(this.defaultModel, tokens);

      // 비용 추적
      if (this.costMonitor) {
        await this.costMonitor.addCost({
          service: 'gpt3.5',
          amount: cost,
          timestamp: new Date(),
          metadata: { operation: 'generateCode', language, concept }
        });
      }

      return code;
    } catch (error) {
      this.logger.error('Failed to generate code example', { error, language, concept });
      throw error;
    }
  }

  /**
   * 자막 최적화 (한국어)
   */
  public async optimizeSubtitles(
    text: string,
    maxLength: number = 40
  ): Promise<string[]> {
    const prompt = `Split the following text into subtitle chunks for video display.
    Each chunk should:
    - Be maximum ${maxLength} characters
    - Break at natural pause points
    - Maintain readability
    - Preserve meaning
    
    Text: "${text}"
    
    Return as JSON array of strings.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: 'You are an expert in subtitle creation and timing.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content || '{"subtitles": []}';
      const { subtitles } = JSON.parse(response);
      
      return subtitles;
    } catch (error) {
      this.logger.error('Failed to optimize subtitles', { error });
      // Fallback: 단순 분할
      return this.simpleSubtitleSplit(text, maxLength);
    }
  }

  /**
   * 단순 자막 분할 (fallback)
   */
  private simpleSubtitleSplit(text: string, maxLength: number): string[] {
    const words = text.split(' ');
    const chunks: string[] = [];
    let current = '';

    for (const word of words) {
      if ((current + ' ' + word).length <= maxLength) {
        current = current ? `${current} ${word}` : word;
      } else {
        if (current) chunks.push(current);
        current = word;
      }
    }
    if (current) chunks.push(current);

    return chunks;
  }

  /**
   * 비용 계산
   */
  private calculateCost(model: GPTModel, tokens: number): number {
    const costs = MODEL_COSTS[model];
    // 간단한 추정: 입력과 출력을 반반으로 가정
    const inputTokens = tokens * 0.4;
    const outputTokens = tokens * 0.6;
    
    return (inputTokens * costs.input + outputTokens * costs.output) / 1000;
  }

  /**
   * 모델 변경
   */
  public setModel(model: GPTModel): void {
    this.defaultModel = model;
    this.logger.info('Model changed', { model });
  }

  /**
   * 토큰 수 추정
   */
  public estimateTokens(text: string): number {
    // 대략적인 추정: 4 characters = 1 token (영어)
    // 한국어는 더 많은 토큰 사용: 2 characters = 1 token
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
    return Math.ceil(text.length / (isKorean ? 2 : 4));
  }
}

export default GPTService;