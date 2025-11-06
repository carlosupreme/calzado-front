import { z } from 'zod';

// Zod schemas for runtime validation
export const ChatRequestSchema = z.object({
  message: z.string().min(1),
  session_id: z.string().optional(),
});

export const ChatResponseSchema = z.object({
  response: z.string(),
  intent: z.string(),
  data_used: z.record(z.string(), z.any()).optional(),
  timestamp: z.string(),
});

// TypeScript types inferred from schemas
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// Chat message types for UI
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  data?: Record<string, any>;
}

// Chat session type
export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
}
