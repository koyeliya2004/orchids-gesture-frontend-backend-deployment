const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'https://gesture-vl7k.onrender.com';
  }
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  return 'https://gesture-vl7k.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async startCamera() {
    const response = await fetch(`${this.baseUrl}/camera/start`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to start camera');
    return response.json();
  }

  async stopCamera() {
    const response = await fetch(`${this.baseUrl}/camera/stop`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to stop camera');
    return response.json();
  }

  async getCameraStatus() {
    const response = await fetch(`${this.baseUrl}/camera/status`);
    if (!response.ok) throw new Error('Failed to get camera status');
    return response.json();
  }

  async resetTracking() {
    const response = await fetch(`${this.baseUrl}/camera/reset`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to reset tracking');
    return response.json();
  }

  async uploadVideo(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/video/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload video');
    }

    return response.json();
  }

  async getVideoInfo(fileId: string) {
    const response = await fetch(`${this.baseUrl}/video/info/${fileId}`);
    if (!response.ok) throw new Error('Failed to get video info');
    return response.json();
  }

  async deleteVideo(fileId: string) {
    const response = await fetch(`${this.baseUrl}/video/${fileId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete video');
    return response.json();
  }

  createWebSocket(): WebSocket {
    const wsUrl = this.baseUrl.replace(/^http(s)?:/, 'ws$1:') + '/ws/live';
    return new WebSocket(wsUrl);
  }
}

export const apiService = new ApiService();
