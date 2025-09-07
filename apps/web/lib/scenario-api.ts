const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4906';

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

function getHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function createScenario(data: any): Promise<any> {
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

export async function getScenarios(projectId?: string): Promise<any> {
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

export async function getScenario(id: string): Promise<any> {
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

export async function updateScenario(id: string, data: any): Promise<any> {
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

export async function deleteScenario(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/scenarios/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.error?.message || error.message || 'Request failed');
  }
}