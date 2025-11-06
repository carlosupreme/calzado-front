import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatService } from '@/api/services/chat';
import type { ChatMessage, ChatSession } from '@/types/chat';

const STORAGE_KEY = 'calzando-chat-session';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function loadSession(): ChatSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored);
    // Convert ISO strings back to Date objects
    session.createdAt = new Date(session.createdAt);
    session.messages = session.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
    return session;
  } catch (error) {
    console.error('Error loading chat session:', error);
    return null;
  }
}

function saveSession(session: ChatSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
}

export function useChat() {
  const [session, setSession] = useState<ChatSession>(() => {
    const existing = loadSession();
    if (existing) return existing;

    return {
      id: generateId(),
      messages: [],
      createdAt: new Date(),
    };
  });

  // Save session to localStorage whenever it changes
  useEffect(() => {
    saveSession(session);
  }, [session]);

  const mutation = useMutation({
    mutationFn: chatService.sendMessage,
    onSuccess: (response) => {
      // Add assistant's response to messages
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(response.timestamp),
        intent: response.intent,
        data: response.data_used,
      };

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }));
    },
    onError: (error) => {
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `Lo siento, ocurrió un error al procesar tu mensaje: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp: new Date(),
      };

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      // Send to API
      mutation.mutate({
        message: content.trim(),
        session_id: session.id,
      });
    },
    [mutation, session.id]
  );

  const clearChat = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      messages: [],
      createdAt: new Date(),
    };
    setSession(newSession);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages: session.messages,
    sendMessage,
    clearChat,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
