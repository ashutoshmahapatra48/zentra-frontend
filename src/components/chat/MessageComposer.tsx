import { useState, type FormEvent, type KeyboardEvent } from 'react';

export function MessageComposer({
  busy,
  error,
  onSend,
}: {
  busy: boolean;
  error: string;
  onSend: (content: string) => Promise<void>;
}) {
  const [prompt, setPrompt] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const content = prompt.trim();
    if (!content || busy) return;
    setPrompt('');
    await onSend(content);
  };
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit(event);
    }
  };
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-5">
      {error && (
        <p role="alert" className="mb-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-2 shadow-lg">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={keyDown}
          rows={2}
          maxLength={12000}
          placeholder="Message Zentra…"
          className="w-full resize-none bg-transparent p-3 outline-none"
        />
        <div className="flex justify-between px-2 text-xs text-muted">
          <span>Enter to send · Shift+Enter for a new line</span>
          <button
            disabled={!prompt.trim() || busy}
            className="rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
