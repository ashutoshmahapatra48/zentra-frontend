export type User = { id: string; fullName: string; email: string };
export type Conversation = { _id: string; title: string; updatedAt: string };
export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
}
export type ChatMessage = {
  _id: string;
  role: MessageRole;
  content: string;
  model?: string;
  usage?: { inputTokens: number; outputTokens: number; totalTokens: number };
  latency?: number;
  status?: 'completed' | 'failed';
  toolCalls?: { name: string; arguments: Record<string, unknown>; result: string }[];
};
