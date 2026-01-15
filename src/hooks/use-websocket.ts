'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { WebSocketMessage, FrameAnalysis } from '@/types/gesture';
import { WebSocketState } from '@/types/gesture';
import { apiService } from '@/lib/api-service';

export interface UseWebSocketReturn {
  connectionState: WebSocketState;
  isConnected: boolean;
  isReady: boolean;
  frameAnalysis: FrameAnalysis | null;
  frameImage: string | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  sendFrame: (frameData: string) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [connectionState, setConnectionState] = useState<WebSocketState>(WebSocketState.DISCONNECTED);
  const [frameAnalysis, setFrameAnalysis] = useState<FrameAnalysis | null>(null);
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const connectionTimeoutRef = useRef<number | null>(null);
  const connectionStateRef = useRef<WebSocketState>(WebSocketState.DISCONNECTED);

  useEffect(() => {
    connectionStateRef.current = connectionState;
  }, [connectionState]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }

    try {
      setConnectionState(WebSocketState.CONNECTING);
      setError(null);
      
      const ws = apiService.createWebSocket();
      wsRef.current = ws;

      connectionTimeoutRef.current = window.setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
          console.error('WebSocket connection timeout - no READY signal received');
          setConnectionState(WebSocketState.ERROR);
          setError('Connection timeout. Backend did not respond in time.');
          ws.close();
        }
      }, 10000);

      ws.onopen = () => {
        console.log('WebSocket transport connected - waiting for READY signal');
        setConnectionState(WebSocketState.CONNECTED);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.message_type === 'ready') {
            console.log('Backend READY signal received');
            setConnectionState(WebSocketState.READY);
            setError(null);
            if (connectionTimeoutRef.current) {
              clearTimeout(connectionTimeoutRef.current);
              connectionTimeoutRef.current = null;
            }
          } else if (message.message_type === 'frame_analysis') {
            if (connectionStateRef.current !== WebSocketState.READY) {
              console.log('Backend READY (implicit from frame_analysis)');
              setConnectionState(WebSocketState.READY);
              if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
                connectionTimeoutRef.current = null;
              }
            }
            
            if (message.data.frame_analysis) {
              setFrameAnalysis(message.data.frame_analysis);
            }
            if (message.data.frame_image) {
              setFrameImage(message.data.frame_image);
            }
          } else if (message.message_type === 'error') {
            setError(message.data.error || 'Unknown error');
            setConnectionState(WebSocketState.ERROR);
          } else if (message.message_type === 'pong') {
            console.debug('Pong received');
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setConnectionState(WebSocketState.ERROR);
        setError('WebSocket connection error. Please check your network connection.');
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        setConnectionState(WebSocketState.DISCONNECTED);
        wsRef.current = null;
        
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
        
        if (event.code === 1006) {
          setError('Connection lost. The server may be unavailable.');
        } else if (event.code !== 1000) {
          setError(`Disconnected: ${event.reason || 'Unknown reason'}`);
        }
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setConnectionState(WebSocketState.ERROR);
      setError('Failed to create WebSocket connection. Please refresh and try again.');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'stop' }));
      } catch (err) {
        console.error('Error sending stop message:', err);
      }
      
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionState(WebSocketState.DISCONNECTED);
    setFrameAnalysis(null);
    setFrameImage(null);
    setError(null);
  }, []);

  const sendFrame = useCallback((frameData: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && connectionStateRef.current === WebSocketState.READY) {
      try {
        wsRef.current.send(JSON.stringify({
          type: 'frame',
          frame: frameData,
          timestamp: Date.now()
        }));
      } catch (err) {
        const errorDetails = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error sending frame:', errorDetails);
        setError(`Failed to send frame to server: ${errorDetails}`);
        setConnectionState(WebSocketState.ERROR);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
      if (reconnectTimeoutRef.current !== null) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (connectionTimeoutRef.current !== null) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [disconnect]);

  return {
    connectionState,
    isConnected: connectionState === WebSocketState.READY,
    isReady: connectionState === WebSocketState.READY,
    frameAnalysis,
    frameImage,
    error,
    connect,
    disconnect,
    sendFrame,
  };
}
