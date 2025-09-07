/**
 * API Client
 */
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
    name: string;
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
declare class ApiClient {
    private token;
    constructor();
    setToken(token: string): void;
    clearToken(): void;
    private request;
    register(email: string, password: string, name: string): Promise<AuthResponse>;
    login(email: string, password: string): Promise<AuthResponse>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User>;
    updateUser(data: Partial<User>): Promise<User>;
    getProjects(): Promise<Project[]>;
    getProject(id: string): Promise<Project>;
    createProject(data: {
        name: string;
        description?: string;
        topic: string;
    }): Promise<Project>;
    updateProject(id: string, data: Partial<Project>): Promise<Project>;
    deleteProject(id: string): Promise<void>;
    getVideos(): Promise<Video[]>;
    getVideo(id: string): Promise<Video>;
    createVideo(data: {
        projectId: string;
        topic: string;
        duration?: number;
        targetAudience?: string;
    }): Promise<Video>;
    deleteVideo(id: string): Promise<void>;
    getCostSummary(): Promise<any>;
    getCostHistory(params?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
}
export declare const api: ApiClient;
export {};
//# sourceMappingURL=api.d.ts.map