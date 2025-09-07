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

export async function generateVideo(data: any): Promise<any> {
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

export async function getVideos(projectId?: string): Promise<any> {
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

export async function getVideo(id: string): Promise<any> {
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

export async function getVideoStatus(id: string): Promise<any> {
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

export async function deleteVideo(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/videos/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.error?.message || error.message || 'Request failed');
  }
}