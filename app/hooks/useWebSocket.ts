import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketIOOptions {
  url: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  authToken?: string;
}

export function useSocketIO({
  url,
  onConnect,
  onDisconnect,
  onError,
  autoConnect = true,
  reconnectionAttempts = Infinity,
  reconnectionDelay = 1000,
  authToken

}: UseSocketIOOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(url, {
      autoConnect,
      reconnection: true,
      reconnectionAttempts,
      reconnectionDelay,
      transports: ['websocket', 'polling'],
      auth: {
        token: authToken
      }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
      setConnectionError(null);
      onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setConnectionError(error.message || 'Connection error occurred');
      onError?.(error);
    });

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
      setConnectionError(error.message || 'Socket error occurred');
      onError?.(error);
    });

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, [url, onConnect, onDisconnect, onError, autoConnect, reconnectionAttempts, reconnectionDelay, authToken]);

  const emit = <T = unknown>(event: string, data?: T) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket.IO is not connected');
    }
  };

  const on = <T = unknown>(event: string, handler: (data: T) => void) => {
    socketRef.current?.on(event, handler);
  };

  const off = <T = unknown>(event: string, handler?: (data: T) => void) => {
    socketRef.current?.off(event, handler);
  };

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    emit,
    on,
    off,
  };
}

