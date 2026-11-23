import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../app/providers';
import { Sidebar } from '../../components/layout/Sidebar';
import { MessageList } from '../../components/chat/MessageList';
import { MessageComposer } from '../../components/chat/MessageComposer';
import { ToolActivity } from '../../components/chat/ToolActivity';
import { getConversation, listConversations, streamChat } from './api';
import type { ChatMessage, Conversation } from './api';
import { MessageRole } from '../../types';

export function ChatPage() {
  const { user, signOut } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [error, setError] = useState('');

  const refreshConversations = useCallback(
    async () => setConversations(await listConversations()),
    [],
  );
  useEffect(() => {
    void refreshConversations().catch((e: Error) => setError(e.message));
  }, [refreshConversations]);

  const selectConversation = async (id: string) => {
    setActiveId(id);
    setError('');
    try {
      const result = await getConversation(id);
      setMessages(result.messages);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const send = async (content: string) => {
    setBusy(true);
    setError('');
    const optimistic: ChatMessage = { _id: crypto.randomUUID(), role: MessageRole.User, content };
    const assistantId = crypto.randomUUID();
    let streamConversationId = activeId;
    setMessages((current) => [...current, optimistic]);
    try {
      const result = await streamChat(activeId, content, {
        onStart: (conversationId, title) => {
          streamConversationId = conversationId;
          setActiveId(conversationId);
          setConversations((current) => {
            const updatedAt = new Date().toISOString();
            const existing = current.some((conversation) => conversation._id === conversationId);
            const updated = existing
              ? current.map((conversation) =>
                  conversation._id === conversationId
                    ? { ...conversation, title, updatedAt }
                    : conversation,
                )
              : [{ _id: conversationId, title, updatedAt }, ...current];
            return updated.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
          });
        },
        onTitle: (title) =>
          setConversations((current) =>
            current.map((conversation) =>
              conversation._id === streamConversationId ? { ...conversation, title } : conversation,
            ),
          ),
        onTool: (name, status) => setActiveTool(status === 'started' ? name : null),
        onDelta: (delta) =>
          setMessages((current) => {
            const existing = current.find((message) => message._id === assistantId);
            if (existing)
              return current.map((message) =>
                message._id === assistantId
                  ? { ...message, content: message.content + delta }
                  : message,
              );
            return [...current, { _id: assistantId, role: MessageRole.Assistant, content: delta }];
          }),
      });
      setActiveId(result.conversationId);
      setMessages((current) =>
        current.map((message) => (message._id === assistantId ? result.message : message)),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      setActiveTool(null);
    }
  };

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setError('');
  };
  const logout = async () => {
    await signOut();
    setConversations([]);
    setMessages([]);
    setActiveId(null);
  };
  const title =
    conversations.find((conversation) => conversation._id === activeId)?.title ||
    'New conversation';

  return (
    <main className="flex h-screen min-h-[520px] bg-surface text-ink">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        fullName={user?.fullName || ''}
        onNewChat={newChat}
        onSelect={(id) => void selectConversation(id)}
        onLogout={() => void logout()}
      />
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[68px] items-center border-b border-line px-6 text-sm">
          {title}
        </header>
        <MessageList messages={messages} busy={busy} />
        <ToolActivity toolName={activeTool} />
        <MessageComposer busy={busy} error={error} onSend={send} />
      </section>
    </main>
  );
}
