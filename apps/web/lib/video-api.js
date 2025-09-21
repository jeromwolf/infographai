"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideo = generateVideo;
exports.getVideos = getVideos;
exports.getVideo = getVideo;
exports.getVideoStatus = getVideoStatus;
exports.deleteVideo = deleteVideo;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4906';
function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}
function getHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}
async function generateVideo(data) {
    const response = await fetch(`${API_URL}/api/videos/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.error?.message || error.message || 'Request failed');
    }
    return response.json();
}
async function getVideos(projectId) {
    const url = projectId
        ? `${API_URL}/api/videos?projectId=${projectId}`
        : `${API_URL}/api/videos`;
    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.error?.message || error.message || 'Request failed');
    }
    return response.json();
}
async function getVideo(id) {
    const response = await fetch(`${API_URL}/api/videos/${id}`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.error?.message || error.message || 'Request failed');
    }
    return response.json();
}
async function getVideoStatus(id) {
    const response = await fetch(`${API_URL}/api/videos/${id}/status`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.error?.message || error.message || 'Request failed');
    }
    return response.json();
}
async function deleteVideo(id) {
    const response = await fetch(`${API_URL}/api/videos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.error?.message || error.message || 'Request failed');
    }
}
