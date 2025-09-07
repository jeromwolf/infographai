/**
 * API Client
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4906';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Project {
  id: string;
  name?: string;  // 일부 버전 호환성
  title?: string; // 새 스키마
  description?: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: string;
  duration: number;
  createdAt: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // 생성자에서 자동으로 토큰 로드
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.error?.message || error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async logout() {
    this.clearToken();
  }

  // User
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/users/me');
  }

  async updateUser(data: Partial<User>): Promise<User> {
    return this.request<User>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/api/projects');
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/api/projects/${id}`);
  }

  async createProject(data: { name?: string; title?: string; description?: string; topic: string }): Promise<Project> {
    // API 서버가 title을 기대하는 경우 처리
    const payload = {
      title: data.title || data.name || '새 프로젝트',
      description: data.description,
      topic: data.topic
    };
    return this.request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Videos
  async getVideos(): Promise<Video[]> {
    return this.request<Video[]>('/api/videos');
  }

  async getVideo(id: string): Promise<Video> {
    return this.request<Video>(`/api/videos/${id}`);
  }

  async createVideo(data: { 
    projectId: string; 
    topic: string; 
    duration?: number; 
    targetAudience?: string 
  }): Promise<Video> {
    return this.request<Video>('/api/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteVideo(id: string): Promise<void> {
    await this.request(`/api/videos/${id}`, {
      method: 'DELETE',
    });
  }

  // Costs
  async getCostSummary(): Promise<any> {
    return this.request('/api/costs/summary');
  }

  async getCostHistory(params?: { limit?: number; offset?: number }): Promise<any> {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/api/costs/history${query ? `?${query}` : ''}`);
  }

  // Additional Video methods
  async downloadVideo(id: string): Promise<any> {
    return this.request(`/api/videos/${id}/download`);
  }

  async generateVideo(data: any): Promise<any> {
    return this.request('/api/videos/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Scenario methods
  async createScenario(data: any): Promise<any> {
    return this.request<any>('/api/scenarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getScenarios(projectId?: string): Promise<any[]> {
    const url = projectId ? `/api/scenarios?projectId=${projectId}` : '/api/scenarios';
    return this.request<any[]>(url);
  }

  async getScenario(id: string): Promise<any> {
    return this.request<any>(`/api/scenarios/${id}`);
  }

  async updateScenario(id: string, data: any): Promise<any> {
    return this.request<any>(`/api/scenarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteScenario(id: string): Promise<void> {
    await this.request(`/api/scenarios/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();