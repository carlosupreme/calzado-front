import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/config/api';
import type { ChatRequest, ChatResponse } from '@/types/chat';

export const chatService = {
  /**
   * Send a message to the chat API
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>(
      API_ENDPOINTS.CHAT,
      request
    );
    return response.data;
  },
};
