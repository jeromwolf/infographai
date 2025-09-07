"use strict";
/**
 * API Client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
class ApiClient {
    token = null;
    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
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
    async register(email, password, name) {
        const response = await this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
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
}
exports.api = new ApiClient();
