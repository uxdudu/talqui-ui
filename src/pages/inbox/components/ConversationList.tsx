import type { Conversation } from "../data";

const CHANNEL_LABELS: Record<Conversation["channel"], string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  "chat-site": "Chat no site",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

function ConversationListItem({
  conversation,
  isSelected,
  onClick,
}: ConversationListItemProps) {
  const { contactName, contactAvatar, channel, lastMessage, unreadCount } =
    conversation;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-(--talqui-radius-sm) px-3 py-2.5 text-left transition-colors duration-200 cursor-pointer ${
        isSelected
          ? "bg-(--talqui-bg-weaker)"
          : "hover:bg-(--talqui-bg-weaker)/70"
      }`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-visible rounded-full bg-(--talqui-bg-weaker) flex items-center justify-center">
        {contactAvatar ? (
          <img
            src={contactAvatar}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-(--talqui-text-medium)">
            {getInitials(contactName)}
          </span>
        )}
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--talqui-green-500) px-1 text-[10px] font-bold leading-none text-white"
            aria-label={`${unreadCount} não lidas`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate text-sm font-semibold ${
              unreadCount > 0
                ? "text-(--talqui-text-strong)"
                : "text-(--talqui-text-primary)"
            }`}
          >
            {contactName}
          </span>
          <span className="shrink-0 text-xs text-(--talqui-text-weak)">
            {lastMessage.time}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="shrink-0 rounded bg-(--talqui-bg-weaker) px-1.5 py-0.5 text-[10px] font-medium text-(--talqui-text-medium)">
            {CHANNEL_LABELS[channel]}
          </span>
          <span className="truncate text-xs text-(--talqui-text-medium)">
            {lastMessage.fromAgent && "Você: "}
            {lastMessage.text}
          </span>
        </div>
      </div>
    </button>
  );
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  emptyComponent: React.ReactNode;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelectConversation,
  emptyComponent,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return <>{emptyComponent}</>;
  }

  return (
    <div className="flex flex-1 flex-col w-full min-w-0 gap-1 overflow-auto px-4 py-2">
      {conversations.map((conv) => (
        <ConversationListItem
          key={conv.id}
          conversation={conv}
          isSelected={selectedId === conv.id}
          onClick={() => onSelectConversation(conv.id)}
        />
      ))}
    </div>
  );
}
