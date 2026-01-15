const STORAGE_KEYS = {
  GESTURE_HISTORY: 'gesture_history',
  USER_PREFERENCES: 'user_preferences',
  ANALYTICS: 'analytics',
  SESSION_DATA: 'session_data',
} as const;

export interface StoredGesture {
  type: string;
  confidence: number;
  timestamp: number;
  sessionId?: string;
}

export interface UserPreferences {
  showPerformanceHUD: boolean;
  showLandmarks: boolean;
  cameraIndex: number;
  theme?: 'dark' | 'light';
}

export interface AnalyticsData {
  totalGestures: number;
  gesturesByType: Record<string, number>;
  averageConfidence: number;
  sessionCount: number;
  totalRuntime: number;
}

export function saveGestureToHistory(gesture: StoredGesture): void {
  try {
    const history = getGestureHistory();
    history.push(gesture);
    const trimmedHistory = history.slice(-100);
    localStorage.setItem(STORAGE_KEYS.GESTURE_HISTORY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save gesture to history:', error);
  }
}

export function getGestureHistory(): StoredGesture[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GESTURE_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load gesture history:', error);
    return [];
  }
}

export function clearGestureHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GESTURE_HISTORY);
  } catch (error) {
    console.error('Failed to clear gesture history:', error);
  }
}

export function getGesturesBySession(sessionId: string): StoredGesture[] {
  const history = getGestureHistory();
  return history.filter(g => g.sessionId === sessionId);
}

export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  try {
    const current = getUserPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save user preferences:', error);
  }
}

export function getUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return stored ? JSON.parse(stored) : {
      showPerformanceHUD: true,
      showLandmarks: true,
      cameraIndex: 0,
      theme: 'dark',
    };
  } catch (error) {
    console.error('Failed to load user preferences:', error);
    return {
      showPerformanceHUD: true,
      showLandmarks: true,
      cameraIndex: 0,
      theme: 'dark',
    };
  }
}

export function updateAnalytics(gesture: StoredGesture): void {
  try {
    const analytics = getAnalytics();
    analytics.totalGestures += 1;
    analytics.gesturesByType[gesture.type] = (analytics.gesturesByType[gesture.type] || 0) + 1;
    const totalConfidence = analytics.averageConfidence * (analytics.totalGestures - 1) + gesture.confidence;
    analytics.averageConfidence = totalConfidence / analytics.totalGestures;
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  } catch (error) {
    console.error('Failed to update analytics:', error);
  }
}

export function getAnalytics(): AnalyticsData {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return stored ? JSON.parse(stored) : {
      totalGestures: 0,
      gesturesByType: {},
      averageConfidence: 0,
      sessionCount: 0,
      totalRuntime: 0,
    };
  } catch (error) {
    console.error('Failed to load analytics:', error);
    return {
      totalGestures: 0,
      gesturesByType: {},
      averageConfidence: 0,
      sessionCount: 0,
      totalRuntime: 0,
    };
  }
}

export function clearAnalytics(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
  } catch (error) {
    console.error('Failed to clear analytics:', error);
  }
}

export function createSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    return `session_${Date.now()}_${array[0].toString(36)}${array[1].toString(36)}`;
  }
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function saveSessionData(sessionId: string, startTime: number): void {
  try {
    const sessionData = {
      sessionId,
      startTime,
      lastActivity: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Failed to save session data:', error);
  }
}

export function getSessionData(): { sessionId: string; startTime: number; lastActivity: number } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load session data:', error);
    return null;
  }
}

export function clearAllData(): void {
  clearGestureHistory();
  clearAnalytics();
  localStorage.removeItem(STORAGE_KEYS.SESSION_DATA);
}

export function exportGestureHistory(): string {
  const history = getGestureHistory();
  const analytics = getAnalytics();
  return JSON.stringify({
    history,
    analytics,
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importGestureHistory(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem(STORAGE_KEYS.GESTURE_HISTORY, JSON.stringify(data.history));
    }
    if (data.analytics) {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(data.analytics));
    }
    return true;
  } catch (error) {
    console.error('Failed to import gesture history:', error);
    return false;
  }
}
