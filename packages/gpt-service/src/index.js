"use strict";
/**
 * GPT Service - OpenAI API Integration
 * IT 교육 콘텐츠 생성을 위한 GPT 서비스
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPTService = exports.GPTModel = void 0;
const openai_1 = __importDefault(require("openai"));
const winston_1 = __importDefault(require("winston"));
// GPT 모델 설정
var GPTModel;
(function (GPTModel) {
    GPTModel["GPT4"] = "gpt-4-turbo-preview";
    GPTModel["GPT35"] = "gpt-3.5-turbo";
    GPTModel["GPT4_VISION"] = "gpt-4-vision-preview";
})(GPTModel || (exports.GPTModel = GPTModel = {}));
// 모델별 비용 (1000 토큰당)
const MODEL_COSTS = {
    [GPTModel.GPT4]: { input: 0.01, output: 0.03 },
    [GPTModel.GPT35]: { input: 0.0005, output: 0.0015 },
    [GPTModel.GPT4_VISION]: { input: 0.01, output: 0.03 }
};
class GPTService {
    openai;
    logger;
    costMonitor = null;
    defaultModel = GPTModel.GPT35;
    constructor(apiKey, costMonitor) {
        const key = apiKey || process.env.OPENAI_API_KEY;
        if (!key) {
            throw new Error('OpenAI API key is required');
        }
        this.openai = new openai_1.default({ apiKey: key });
        this.costMonitor = costMonitor || null;
        // Logger 설정
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'gpt-service.log' })
            ]
        });
    }
    /**
     * IT 교육 스크립트 생성
     */
    async generateScript(options) {
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
            const script = JSON.parse(response);
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
        }
        catch (error) {
            this.logger.error('Failed to generate script', { error, topic });
            throw error;
        }
    }
    /**
     * 인포그래픽 설명 생성
     */
    async generateInfographicDescription(prompt) {
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
            const infographic = JSON.parse(response);
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
        }
        catch (error) {
            this.logger.error('Failed to generate infographic', { error, concept });
            throw error;
        }
    }
    /**
     * 코드 예제 생성
     */
    async generateCodeExample(language, concept, level) {
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
        }
        catch (error) {
            this.logger.error('Failed to generate code example', { error, language, concept });
            throw error;
        }
    }
    /**
     * 자막 최적화 (한국어)
     */
    async optimizeSubtitles(text, maxLength = 40) {
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
        }
        catch (error) {
            this.logger.error('Failed to optimize subtitles', { error });
            // Fallback: 단순 분할
            return this.simpleSubtitleSplit(text, maxLength);
        }
    }
    /**
     * 단순 자막 분할 (fallback)
     */
    simpleSubtitleSplit(text, maxLength) {
        const words = text.split(' ');
        const chunks = [];
        let current = '';
        for (const word of words) {
            if ((current + ' ' + word).length <= maxLength) {
                current = current ? `${current} ${word}` : word;
            }
            else {
                if (current)
                    chunks.push(current);
                current = word;
            }
        }
        if (current)
            chunks.push(current);
        return chunks;
    }
    /**
     * 비용 계산
     */
    calculateCost(model, tokens) {
        const costs = MODEL_COSTS[model];
        // 간단한 추정: 입력과 출력을 반반으로 가정
        const inputTokens = tokens * 0.4;
        const outputTokens = tokens * 0.6;
        return (inputTokens * costs.input + outputTokens * costs.output) / 1000;
    }
    /**
     * 모델 변경
     */
    setModel(model) {
        this.defaultModel = model;
        this.logger.info('Model changed', { model });
    }
    /**
     * 토큰 수 추정
     */
    estimateTokens(text) {
        // 대략적인 추정: 4 characters = 1 token (영어)
        // 한국어는 더 많은 토큰 사용: 2 characters = 1 token
        const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
        return Math.ceil(text.length / (isKorean ? 2 : 4));
    }
}
exports.GPTService = GPTService;
exports.default = GPTService;
