"use strict";
/**
 * API Client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4906';
class ApiClient {
    token = null;
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
    setToken(token) {
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
    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = {
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
    async register(data) {
        const response = await this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        this.setToken(response.token);
        return response;
    }
    async login(email, password) {
        const response = await this.request('/api/auth/login', {
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
    async getCurrentUser() {
        return this.request('/api/users/me');
    }
    async updateUser(data) {
        return this.request('/api/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
    // Projects
    async getProjects() {
        return this.request('/api/projects');
    }
    async getProject(id) {
        return this.request(`/api/projects/${id}`);
    }
    async createProject(data) {
        return this.request('/api/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async updateProject(id, data) {
        return this.request(`/api/projects/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
    async deleteProject(id) {
        await this.request(`/api/projects/${id}`, {
            method: 'DELETE',
        });
    }
    // Videos
    async getVideos() {
        return this.request('/api/videos');
    }
    async getVideo(id) {
        return this.request(`/api/videos/${id}`);
    }
    async createVideo(data) {
        return this.request('/api/videos', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async deleteVideo(id) {
        await this.request(`/api/videos/${id}`, {
            method: 'DELETE',
        });
    }
    // Costs
    async getCostSummary() {
        return this.request('/api/costs/summary');
    }
    async getCostHistory(params) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/api/costs/history${query ? `?${query}` : ''}`);
    }
    // Additional Video methods
    async downloadVideo(id) {
        return this.request(`/api/videos/${id}/download`);
    }
    async generateVideo(data) {
        return this.request('/api/videos/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    // Scenario methods
    async createScenario(data) {
        return this.request('/api/scenarios', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async getScenarios(projectId) {
        const url = projectId ? `/api/scenarios?projectId=${projectId}` : '/api/scenarios';
        return this.request(url);
    }
    async getScenario(id) {
        return this.request(`/api/scenarios/${id}`);
    }
    async updateScenario(id, data) {
        return this.request(`/api/scenarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
    async deleteScenario(id) {
        await this.request(`/api/scenarios/${id}`, {
            method: 'DELETE',
        });
    }
}
exports.api = new ApiClient();
