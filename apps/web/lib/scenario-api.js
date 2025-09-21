"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScenario = createScenario;
exports.getScenarios = getScenarios;
exports.getScenario = getScenario;
exports.updateScenario = updateScenario;
exports.deleteScenario = deleteScenario;
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
async function createScenario(data) {
    const response = await fetch(`${API_URL}/api/scenarios`, {
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
async function getScenarios(projectId) {
    const url = projectId
        ? `${API_URL}/api/scenarios?projectId=${projectId}`
        : `${API_URL}/api/scenarios`;
    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.error?.message || error.message || 'Request failed');
    }
    const data = await response.json();
    return data;
}
async function getScenario(id) {
    const response = await fetch(`${API_URL}/api/scenarios/${id}`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.error?.message || error.message || 'Request failed');
    }
    return response.json();
}
async function updateScenario(id, data) {
    const response = await fetch(`${API_URL}/api/scenarios/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.error?.message || error.message || 'Request failed');
    }
    return response.json();
}
async function deleteScenario(id) {
    const response = await fetch(`${API_URL}/api/scenarios/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.error?.message || error.message || 'Request failed');
    }
}
