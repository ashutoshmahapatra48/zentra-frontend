import type { ChatMessage } from '../../features/conversations/api';

export function MessageList({ messages, busy }: { messages: ChatMessage[]; busy: boolean }) {
  if (!messages.length)
    return (
      <div className="grid min-h-0 flex-1 place-items-center px-5 text-center">
        <div>
          <p className="eyebrow text-primary">Your AI chat</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">What&apos;s on your mind?</h1>
        </div>
      </div>
    );
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-7 px-6 py-8">
        {messages.map((message) => (
          <article
            key={message._id}
            className={
              message.role === 'user'
                ? 'ml-auto max-w-[85%] rounded-2xl bg-primary-pale p-4'
                : 'whitespace-pre-wrap px-1 py-2'
            }
          >
            <p className="mb-1 text-xs font-semibold text-muted">
              {message.role === 'user' ? 'You' : 'Zentra'}
            </p>
            {message.content}
          </article>
        ))}
        {busy && (
          <p className="text-sm text-muted" role="status">
            Zentra is thinking…
          </p>
        )}
      </div>
    </div>
  );
}
