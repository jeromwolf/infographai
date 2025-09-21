const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4906';

export interface GenerateVideoRequest {
  topic: string;
  options: {
    duration: 30 | 60 | 90;
    style: 'professional' | 'casual' | 'technical';
    targetAudience: 'beginner' | 'intermediate' | 'advanced';
    language: 'ko' | 'en';
  };
}

export interface VideoGenerationResponse {
  id: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  scenarioId?: string;
  error?: string;
}

class AIAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // AI 비디오 생성 시작
  async generateVideo(data: GenerateVideoRequest): Promise<VideoGenerationResponse> {
    return this.request('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 생성 상태 확인
  async getGenerationStatus(id: string): Promise<VideoGenerationResponse> {
    return this.request(`/api/ai/generate/${id}`);
  }

  // 생성된 시나리오 가져오기
  async getGeneratedScenario(id: string) {
    return this.request(`/api/ai/scenarios/${id}`);
  }

  // 시나리오 편집
  async updateGeneratedScenario(id: string, updates: any) {
    return this.request(`/api/ai/scenarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // 편집된 시나리오로 비디오 재생성
  async regenerateVideo(scenarioId: string) {
    return this.request(`/api/ai/regenerate`, {
      method: 'POST',
      body: JSON.stringify({ scenarioId }),
    });
  }

  // 인기 주제 가져오기
  async getPopularTopics() {
    return this.request('/api/ai/topics/popular');
  }

  // 주제 추천
  async getSuggestedTopics(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request(`/api/ai/topics/suggestions${query}`);
  }
}

export const aiApi = new AIAPI();