export type User = { id: string; fullName: string; email: string };
export type Conversation = { _id: string; title: string; updatedAt: string };
export type ChatMessage = { _id: string; role: 'user' | 'assistant'; content: string };
