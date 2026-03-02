import { useState, useRef, useEffect } from "react";
import { Icons } from "../../../components/icons";
import type { Conversation, Message } from "../data";
import { MOCK_CONVERSATIONS } from "../data";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

type ChatInputMode = "resposta" | "lembrete" | "atalhos" | "acoes";

const INPUT_MODES: { id: ChatInputMode; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "resposta", label: "Resposta", icon: Icons.ChatBubble },
  { id: "lembrete", label: "Lembrete", icon: Icons.Reminder },
  { id: "atalhos", label: "Atalhos", icon: Icons.Shortcut },
  { id: "acoes", label: "Ações", icon: Icons.Hashtag },
];

const CHANNEL_LABELS: Record<Conversation["channel"], string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  "chat-site": "Chat no site",
};

function MessageBubble({
  message,
  contactName,
  reactionsOverride,
  onReply,
  onReact,
  onForward,
}: {
  message: Message;
  contactName: string;
  reactionsOverride?: { emoji: string; count: number }[];
  onReply: (msg: Message) => void;
  onReact: (msg: Message, emoji: string) => void;
  onForward: (msg: Message) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAgent = message.fromAgent;
  const reactions = reactionsOverride ?? message.reactions ?? [];

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  return (
    <div
      className={`group flex w-full ${isAgent ? "justify-end" : "justify-start"}`}
    >
      <div className="relative flex max-w-[85%] flex-col items-end gap-0.5">
        <div
          className={`flex max-w-full flex-col gap-0.5 rounded-(--talqui-radius-lg) px-3 py-2 ${
            isAgent
              ? "bg-(--talqui-text-primary) text-white"
              : "bg-(--talqui-bg-weaker) text-(--talqui-text-strong)"
          }`}
        >
          {message.replyTo && (
            <div
              className={`mb-1.5 border-l-2 pl-2 text-xs ${
                isAgent ? "border-white/60 text-white/90" : "border-(--talqui-text-weak) text-(--talqui-text-medium)"
              }`}
            >
              <span className="font-semibold">{message.replyTo.senderName ?? contactName}</span>
              <p className="truncate">{message.replyTo.preview}</p>
            </div>
          )}
          {!isAgent && (
            <span className="text-[10px] font-semibold text-(--talqui-text-medium)">
              {message.senderName ?? contactName}
            </span>
          )}
          <p className="text-sm leading-5">{message.text}</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span
              className={`text-[10px] ${isAgent ? "text-white/80" : "text-(--talqui-text-weak)"}`}
            >
              {message.time}
            </span>
            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
                  className="flex h-6 w-6 items-center justify-center rounded-(--talqui-radius-sm) hover:bg-black/10 cursor-pointer"
                  aria-label="Ações da mensagem"
                >
                  <Icons.MoreVertical size={14} />
                </button>
                {menuOpen && (
                  <div
                    className={`absolute bottom-full z-10 mb-1 min-w-[160px] rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white py-1 shadow-lg ${
                      isAgent ? "right-0" : "left-0"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => { onReply(message); setMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-(--talqui-text-primary) hover:bg-(--talqui-bg-weaker) cursor-pointer"
                    >
                      <Icons.Reply size={16} />
                      Responder
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setReactionPickerOpen((o) => !o)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-(--talqui-text-primary) hover:bg-(--talqui-bg-weaker) cursor-pointer"
                      >
                        <Icons.Emoji size={16} />
                        Reagir
                      </button>
                      {reactionPickerOpen && (
                        <div
                          className={`absolute z-20 flex gap-0.5 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white p-1 shadow-lg ${
                            isAgent ? "right-full top-0 mr-1" : "left-full top-0 ml-1"
                          }`}
                        >
                          {REACTION_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => { onReact(message, emoji); setReactionPickerOpen(false); setMenuOpen(false); }}
                              className="flex h-8 w-8 items-center justify-center rounded-(--talqui-radius-sm) text-lg hover:bg-(--talqui-bg-weaker) cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => { onForward(message); setMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-(--talqui-text-primary) hover:bg-(--talqui-bg-weaker) cursor-pointer"
                    >
                      <Icons.Forward size={16} />
                      Encaminhar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 rounded-(--talqui-radius-sm) bg-(--talqui-bg-weaker)/80 px-1.5 py-0.5 mt-0.5">
            {reactions.map((r) => (
              <span key={r.emoji} className="text-xs">
                {r.emoji} {r.count > 1 ? r.count : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConversationChatPanelProps {
  conversation: Conversation;
  onBack?: () => void;
}

export function ConversationChatPanel({
  conversation,
  onBack,
}: ConversationChatPanelProps) {
  const { contactName, contactAvatar, messages } = conversation;
  const [inputMode, setInputMode] = useState<ChatInputMode>("resposta");
  const [messageText, setMessageText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [messageReactions, setMessageReactions] = useState<Record<string, { emoji: string; count: number }[]>>({});
  const [forwardMessage, setForwardMessage] = useState<Message | null>(null);

  const mergeReactions = (msg: Message): { emoji: string; count: number }[] => {
    const fromMsg = msg.reactions ?? [];
    const fromState = messageReactions[msg.id] ?? [];
    const map = new Map<string, number>();
    fromMsg.forEach((r) => map.set(r.emoji, (map.get(r.emoji) ?? 0) + r.count));
    fromState.forEach((r) => map.set(r.emoji, (map.get(r.emoji) ?? 0) + r.count));
    return Array.from(map.entries()).map(([emoji, count]) => ({ emoji, count }));
  };

  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    setInputMode("resposta");
  };

  const handleReact = (msg: Message, emoji: string) => {
    setMessageReactions((prev) => {
      const list = prev[msg.id] ?? [];
      const i = list.findIndex((r) => r.emoji === emoji);
      let next: { emoji: string; count: number }[];
      if (i >= 0) {
        next = list.slice();
        next[i] = { ...next[i], count: next[i].count + 1 };
      } else next = [...list, { emoji, count: 1 }];
      return { ...prev, [msg.id]: next };
    });
  };

  const handleForward = (msg: Message) => {
    setForwardMessage(msg);
  };

  const otherConversations = MOCK_CONVERSATIONS.filter((c) => c.id !== conversation.id);

  const placeholderByMode: Record<ChatInputMode, string> = {
    resposta: `Escreva sua resposta para ${contactName}`,
    lembrete: "Criar lembrete para esta conversa",
    atalhos: "Digite um atalho ou escolha abaixo",
    acoes: "Buscar ou escolher uma ação",
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden bg-white">
      {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-(--talqui-border-weak) px-4 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--talqui-radius-lg) text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker) transition-colors duration-200 cursor-pointer"
            aria-label="Voltar"
          >
            <Icons.ArrowLeft size={20} />
          </button>
        )}
        <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-(--talqui-bg-weaker) items-center justify-center">
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
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-(--talqui-text-strong)">
            {contactName}
          </h2>
          <p className="text-xs text-(--talqui-text-weak)">Conversa ativa</p>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--talqui-radius-lg) text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker) transition-colors duration-200 cursor-pointer"
          aria-label="Mais opções"
        >
          <Icons.MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto px-4 py-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            contactName={contactName}
            reactionsOverride={mergeReactions(msg)}
            onReply={handleReply}
            onReact={handleReact}
            onForward={handleForward}
          />
        ))}
      </div>

      {/* Área de input com abas e ações */}
      <div className="shrink-0 border-t border-(--talqui-border-weak) bg-white px-4 py-3">
        {/* Preview de resposta (quando respondendo a uma mensagem) */}
        {replyingTo && (
          <div className="mb-2 flex items-center gap-2 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-(--talqui-bg-weaker)/50 px-3 py-2">
            <Icons.Reply size={16} className="shrink-0 text-(--talqui-text-weak)" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-(--talqui-text-medium)">
                {replyingTo.senderName ?? contactName}
              </p>
              <p className="truncate text-xs text-(--talqui-text-weak)">{replyingTo.text}</p>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-weak) hover:bg-white/60 hover:text-(--talqui-text-primary) transition-colors duration-200 cursor-pointer"
              aria-label="Cancelar resposta"
            >
              <Icons.Close size={16} />
            </button>
          </div>
        )}

        {/* Abas: Resposta, Lembrete, Atalhos, Ações */}
        <div className="mb-3 flex gap-0 rounded-(--talqui-radius-lg) bg-(--talqui-bg-weaker) p-0.5">
          {INPUT_MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setInputMode(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-(--talqui-radius-sm) px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                inputMode === id
                  ? "bg-white text-(--talqui-text-primary) shadow-sm"
                  : "text-(--talqui-text-medium) hover:text-(--talqui-text-strong)"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        {/* Campo de texto + ícones */}
        <div className="flex items-end gap-2 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-(--talqui-bg-weaker)/50 px-3 py-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={placeholderByMode[inputMode]}
            rows={1}
            className="min-h-[40px] min-w-0 flex-1 resize-none bg-transparent text-sm leading-5 text-(--talqui-text-primary) placeholder:text-(--talqui-text-weak) focus:outline-none"
            aria-label="Mensagem"
          />
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-medium) hover:bg-white/60 transition-colors duration-200 cursor-pointer"
              aria-label="Adicionar emoji"
            >
              <Icons.Emoji size={20} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-medium) hover:bg-white/60 transition-colors duration-200 cursor-pointer"
              aria-label="Anexar arquivos"
            >
              <Icons.Attachment size={20} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-(--talqui-radius-sm) bg-(--talqui-bg-weaker) text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker)/80 transition-colors duration-200 cursor-pointer"
              aria-label="Enviar mensagem de voz"
            >
              <Icons.Voice size={20} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-(--talqui-radius-sm) bg-(--talqui-text-primary) text-white hover:opacity-90 transition-opacity duration-200 cursor-pointer"
              aria-label="Enviar mensagem"
            >
              <Icons.Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal encaminhar */}
      {forwardMessage && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/30"
          onClick={() => setForwardMessage(null)}
          aria-hidden
        >
          <div
            className="w-full max-w-sm rounded-(--talqui-radius-xl) border border-(--talqui-border-weak) bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-(--talqui-text-strong)">Encaminhar mensagem</h3>
            <p className="mt-1 truncate text-sm text-(--talqui-text-medium)">&quot;{forwardMessage.text}&quot;</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-(--talqui-text-weak)">
              Encaminhar para
            </p>
            <ul className="mt-2 max-h-48 overflow-auto rounded-(--talqui-radius-lg) border border-(--talqui-border-weak)">
              {otherConversations.length === 0 ? (
                <li className="px-3 py-4 text-center text-sm text-(--talqui-text-weak)">
                  Nenhuma outra conversa
                </li>
              ) : (
                otherConversations.map((conv) => (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setForwardMessage(null);
                        console.log("Encaminhar para", conv.contactName);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-(--talqui-text-primary) hover:bg-(--talqui-bg-weaker) cursor-pointer"
                    >
                      <span className="font-medium">{conv.contactName}</span>
                      <span className="text-xs text-(--talqui-text-weak)">{CHANNEL_LABELS[conv.channel]}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setForwardMessage(null)}
                className="rounded-(--talqui-radius-sm) px-3 py-1.5 text-sm font-medium text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker) cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
