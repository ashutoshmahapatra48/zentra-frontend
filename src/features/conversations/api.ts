import axios from 'axios';
import { apiClient, http } from '../../lib/http';
import type { ChatMessage, Conversation } from '../../types';

export type { ChatMessage, Conversation } from '../../types';
export const listConversations = () => http<Conversation[]>('/conversations');
export const getConversation = (id: string) =>
  http<{ conversation: Conversation; messages: ChatMessage[] }>(`/conversations/${id}/messages`);

type StreamResult = { conversationId: string; message: ChatMessage };
type StreamHandlers = {
  onStart: (conversationId: string, title: string) => void;
  onTitle: (title: string) => void;
  onDelta: (delta: string) => void;
  onTool: (name: string, status: 'started' | 'completed') => void;
};

export async function streamChat(
  conversationId: string | null,
  content: string,
  handlers: StreamHandlers,
): Promise<StreamResult> {
  let buffer = '';
  let responseOffset = 0;
  let completed: StreamResult | undefined;
  let streamError: Error | undefined;

  const handleFrame = (frame: string) => {
    const eventName = frame
      .split('\n')
      .find((line) => line.startsWith('event: '))
      ?.slice(7);
    const dataLine = frame
      .split('\n')
      .find((line) => line.startsWith('data: '))
      ?.slice(6);
    if (!eventName || !dataLine) return;
    const data = JSON.parse(dataLine);
    if (eventName === 'start') handlers.onStart(data.conversationId, data.title);
    if (eventName === 'title') handlers.onTitle(data.title);
    if (eventName === 'delta') handlers.onDelta(data.delta);
    if (eventName === 'tool') handlers.onTool(data.name, data.status);
    if (eventName === 'error') streamError = new Error(data.message || 'The stream failed');
    if (eventName === 'complete') completed = data.data as StreamResult;
  };

  const consume = (chunk: string) => {
    buffer += chunk.replace(/\r\n/g, '\n');
    const frames = buffer.split('\n\n');
    buffer = frames.pop() || '';
    for (const frame of frames) {
      try {
        handleFrame(frame);
      } catch (error) {
        streamError = error as Error;
      }
    }
  };

  let response;
  try {
    response = await apiClient.post<string>(
      '/chat',
      { conversationId, content },
      {
        responseType: 'text',
        headers: { Accept: 'text/event-stream' },
        onDownloadProgress: (progress) => {
          const xhr = progress.event.target as XMLHttpRequest;
          const text = xhr.responseText || '';
          consume(text.slice(responseOffset));
          responseOffset = text.length;
        },
      },
    );
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || error.message || 'Request failed');
    }
    throw error;
  }

  consume(response.data.slice(responseOffset));
  if (buffer.trim()) {
    try {
      handleFrame(buffer);
    } catch (error) {
      streamError = error as Error;
    }
  }
  if (streamError) throw streamError;
  if (!completed) throw new Error('The stream ended before the response was complete');
  return completed;
}
