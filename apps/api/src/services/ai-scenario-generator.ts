import OpenAI from 'openai';

// Scene Types
export type SceneType = 
  | 'intro'        // 오프닝 - 주제 소개
  | 'problem'      // 문제 정의
  | 'concept'      // 핵심 개념 설명
  | 'process'      // 프로세스/워크플로우
  | 'comparison'   // 비교 분석
  | 'benefits'     // 장점/특징
  | 'example'      // 실제 사례
  | 'tutorial'     // 실습/튜토리얼
  | 'conclusion';  // 결론/CTA

// Visual Element Types
export interface VisualElement {
  type: 'icon' | 'chart' | 'diagram' | 'code' | 'text' | 'shape' | 'image';
  id: string;
  content?: any;
  style?: {
    color?: string;
    size?: 'small' | 'medium' | 'large';
    position?: 'center' | 'left' | 'right' | 'top' | 'bottom';
  };
}

// Animation Types
export interface SceneAnimation {
  type: 'fadeIn' | 'slideIn' | 'zoomIn' | 'typewriter' | 'draw' | 'morph';
  target: string;
  duration: number;
  delay?: number;
}

// Enhanced Scene Structure
export interface EnhancedScene {
  id: string;
  type: SceneType;
  duration: number;
  title: string;
  subtitle?: string;
  narration: string;
  layout: 'center' | 'split' | 'grid' | 'timeline' | 'comparison';
  visualElements: VisualElement[];
  animations: SceneAnimation[];
  dataPoints?: Array<{
    label: string;
    value: string | number;
    highlight?: boolean;
  }>;
}

export interface GenerationOptions {
  duration: 30 | 60 | 90;
  style: 'professional' | 'casual' | 'technical';
  targetAudience: 'beginner' | 'intermediate' | 'advanced';
  language: 'ko' | 'en';
}

export class AIScenarioGenerator {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY
    });
  }

  async generateScenario(topic: string, options: GenerationOptions = {
    duration: 30,
    style: 'professional',
    targetAudience: 'intermediate',
    language: 'ko'
  }): Promise<EnhancedScene[]> {
    
    // Calculate scene count and duration
    const sceneCount = options.duration / 5; // 5 seconds per scene
    
    const systemPrompt = `You are an expert educational video scenario creator specializing in IT/Tech topics.
Create a structured video scenario with exactly ${sceneCount} scenes.
Each scene should be 5 seconds long.
Language: ${options.language === 'ko' ? 'Korean' : 'English'}
Style: ${options.style}
Target Audience: ${options.targetAudience}

Return a JSON array of scenes with this structure:
{
  "id": "scene_001",
  "type": "intro|problem|concept|process|comparison|benefits|example|tutorial|conclusion",
  "duration": 5,
  "title": "Scene Title",
  "subtitle": "Optional Subtitle",
  "narration": "What to say during this scene",
  "layout": "center|split|grid|timeline|comparison",
  "visualElements": [
    {
      "type": "icon|chart|diagram|code|text|shape",
      "id": "element_1",
      "content": "specific content or data",
      "style": { "color": "#hex", "size": "small|medium|large", "position": "center|left|right|top|bottom" }
    }
  ],
  "animations": [
    {
      "type": "fadeIn|slideIn|zoomIn|typewriter|draw|morph",
      "target": "element_id",
      "duration": 1,
      "delay": 0
    }
  ],
  "dataPoints": [
    { "label": "Label", "value": "Value", "highlight": true }
  ]
}`;

    const userPrompt = `Create a ${options.duration}-second educational video scenario about: ${topic}

Scene Distribution Guidelines:
1. Intro (1 scene): Hook and introduce topic
2. Core Content (${sceneCount - 2} scenes): Main concepts, explanations, examples
3. Conclusion (1 scene): Summary and call-to-action

Make it engaging with:
- Clear, concise titles
- Informative narration (1-2 sentences per scene)
- Relevant visual elements
- Smooth animations
- Data points where applicable`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content generated');

      const result = JSON.parse(content);
      const scenes = result.scenes || result;
      
      // Validate and ensure all scenes have required fields
      return this.validateScenes(scenes);
    } catch (error) {
      console.error('AI Generation Error:', error);
      // Fallback to template-based generation
      return this.generateTemplateScenario(topic, sceneCount);
    }
  }

  private validateScenes(scenes: any[]): EnhancedScene[] {
    return scenes.map((scene, index) => ({
      id: scene.id || `scene_${String(index + 1).padStart(3, '0')}`,
      type: scene.type || 'concept',
      duration: scene.duration || 5,
      title: scene.title || `Scene ${index + 1}`,
      subtitle: scene.subtitle,
      narration: scene.narration || '',
      layout: scene.layout || 'center',
      visualElements: scene.visualElements || [],
      animations: scene.animations || [
        {
          type: 'fadeIn',
          target: 'main',
          duration: 0.5,
          delay: 0
        }
      ],
      dataPoints: scene.dataPoints
    }));
  }

  private generateTemplateScenario(topic: string, sceneCount: number): EnhancedScene[] {
    // Template-based fallback for when AI is unavailable
    const scenes: EnhancedScene[] = [];
    
    // Intro
    scenes.push({
      id: 'scene_001',
      type: 'intro',
      duration: 5,
      title: topic,
      subtitle: 'Complete Guide',
      narration: `Let's explore ${topic} - a revolutionary technology transforming the industry.`,
      layout: 'center',
      visualElements: [
        {
          type: 'text',
          id: 'title',
          content: topic,
          style: { size: 'large', position: 'center' }
        },
        {
          type: 'shape',
          id: 'bg_shape',
          content: 'gradient_circle',
          style: { size: 'large', position: 'center' }
        }
      ],
      animations: [
        { type: 'zoomIn', target: 'bg_shape', duration: 1, delay: 0 },
        { type: 'fadeIn', target: 'title', duration: 1, delay: 0.5 }
      ]
    });

    // Core content scenes
    const contentTypes: SceneType[] = ['concept', 'process', 'benefits', 'example'];
    for (let i = 1; i < sceneCount - 1; i++) {
      const sceneType = contentTypes[(i - 1) % contentTypes.length];
      scenes.push({
        id: `scene_${String(i + 1).padStart(3, '0')}`,
        type: sceneType,
        duration: 5,
        title: `${this.getSceneTypeTitle(sceneType)} ${i}`,
        narration: `Understanding the ${sceneType} of ${topic}.`,
        layout: this.getLayoutForType(sceneType),
        visualElements: this.getVisualElementsForType(sceneType),
        animations: [
          { type: 'slideIn', target: 'main', duration: 0.5, delay: 0 }
        ]
      });
    }

    // Conclusion
    scenes.push({
      id: `scene_${String(sceneCount).padStart(3, '0')}`,
      type: 'conclusion',
      duration: 5,
      title: 'Get Started Today',
      subtitle: 'Transform Your Projects',
      narration: `Start implementing ${topic} in your projects today!`,
      layout: 'center',
      visualElements: [
        {
          type: 'text',
          id: 'cta',
          content: 'Start Now',
          style: { size: 'large', position: 'center' }
        },
        {
          type: 'icon',
          id: 'arrow',
          content: 'arrow-right',
          style: { size: 'medium', position: 'bottom' }
        }
      ],
      animations: [
        { type: 'fadeIn', target: 'cta', duration: 1, delay: 0 },
        { type: 'slideIn', target: 'arrow', duration: 0.5, delay: 1 }
      ]
    });

    return scenes;
  }

  private getSceneTypeTitle(type: SceneType): string {
    const titles: Record<SceneType, string> = {
      intro: 'Introduction',
      problem: 'The Challenge',
      concept: 'Core Concept',
      process: 'How It Works',
      comparison: 'Comparison',
      benefits: 'Key Benefits',
      example: 'Real Example',
      tutorial: 'Tutorial',
      conclusion: 'Conclusion'
    };
    return titles[type];
  }

  private getLayoutForType(type: SceneType): EnhancedScene['layout'] {
    const layouts: Record<SceneType, EnhancedScene['layout']> = {
      intro: 'center',
      problem: 'split',
      concept: 'grid',
      process: 'timeline',
      comparison: 'comparison',
      benefits: 'grid',
      example: 'split',
      tutorial: 'split',
      conclusion: 'center'
    };
    return layouts[type];
  }

  private getVisualElementsForType(type: SceneType): VisualElement[] {
    switch (type) {
      case 'concept':
        return [
          { type: 'diagram', id: 'main_diagram', content: 'concept_map' },
          { type: 'text', id: 'label_1', content: 'Component A' },
          { type: 'text', id: 'label_2', content: 'Component B' }
        ];
      
      case 'process':
        return [
          { type: 'diagram', id: 'flow', content: 'flowchart' },
          { type: 'icon', id: 'step_1', content: 'circle-1' },
          { type: 'icon', id: 'step_2', content: 'circle-2' },
          { type: 'icon', id: 'step_3', content: 'circle-3' }
        ];
      
      case 'benefits':
        return [
          { type: 'icon', id: 'benefit_1', content: 'check' },
          { type: 'icon', id: 'benefit_2', content: 'star' },
          { type: 'icon', id: 'benefit_3', content: 'lightning' },
          { type: 'chart', id: 'stats', content: 'bar_chart' }
        ];
      
      case 'example':
        return [
          { type: 'code', id: 'code_sample', content: 'implementation' },
          { type: 'diagram', id: 'architecture', content: 'system_diagram' }
        ];
      
      default:
        return [
          { type: 'text', id: 'main', content: 'Content' }
        ];
    }
  }
}