import type { Conversation } from '../../features/conversations/api';

export function Sidebar({
  conversations,
  activeId,
  fullName,
  onNewChat,
  onSelect,
  onLogout,
}: {
  conversations: Conversation[];
  activeId: string | null;
  fullName: string;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="flex w-72 shrink-0 flex-col bg-sidebar p-4 text-sidebar-ink">
      <div className="py-4 font-display text-xl font-semibold">✦ Zentra</div>
      <button
        onClick={onNewChat}
        className="rounded-xl border border-sidebar-line bg-sidebar-button p-3 text-left"
      >
        ＋ New chat
      </button>
      <p className="eyebrow mt-7 px-2 text-sidebar-muted">Conversations</p>
      <div className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {conversations.map((item) => (
          <button
            key={item._id}
            onClick={() => onSelect(item._id)}
            className={`block w-full truncate rounded-lg px-3 py-2.5 text-left text-sm ${activeId === item._id ? 'bg-sidebar-hover' : 'text-sidebar-muted hover:bg-sidebar-hover'}`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="border-t border-sidebar-line pt-3 text-sm">
        <p className="truncate">{fullName}</p>
        <button onClick={onLogout} className="mt-2 text-xs text-sidebar-muted hover:text-white">
          Log out
        </button>
      </div>
    </aside>
  );
}
