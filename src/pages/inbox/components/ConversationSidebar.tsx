import { useState } from "react";
import { Icons } from "../../../components/icons";
import { getExtensionLogoUrl } from "../../../lib/brandfetch";
import { Button } from "../../../components/ui/Button";
import type { Conversation } from "../data";
import type { Extension } from "../../extensoes/data";

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

interface ConversationSidebarProps {
  conversation: Conversation;
  extensions: Extension[];
  onStartService?: () => void;
  onUseExtension?: (extensionId: string) => void;
}

function CollapsibleSection({
  title,
  icon: Icon,
  open: initialOpen,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  open?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(initialOpen ?? true);

  return (
    <section className="border-b border-(--talqui-border-weak)">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 py-3 text-left transition-colors duration-200 cursor-pointer hover:bg-(--talqui-bg-weaker)/50"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="shrink-0 text-(--talqui-text-medium)" />
          <span className="text-xs font-semibold uppercase tracking-wide text-(--talqui-text-medium)">
            {title}
          </span>
        </div>
        {open ? (
          <Icons.ChevronUp size={16} className="shrink-0 text-(--talqui-text-weak)" />
        ) : (
          <Icons.ChevronDown size={16} className="shrink-0 text-(--talqui-text-weak)" />
        )}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </section>
  );
}

export function ConversationSidebar({
  conversation,
  extensions,
  onStartService,
  onUseExtension,
}: ConversationSidebarProps) {
  const {
    contactName,
    contactAvatar,
    contactEmail,
    contactPhone,
    channel,
    assignedAttendant,
    tags = [],
  } = conversation;

  const enabledExtensions = extensions.filter((e) => e.enabled);

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col overflow-hidden border-l border-(--talqui-border-weak) bg-white">
      <div className="flex flex-1 flex-col overflow-auto px-4 py-4">
        {/* Informações do usuário */}
        <div className="flex flex-col gap-3 border-b border-(--talqui-border-weak) pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-(--talqui-bg-weaker)">
              {contactAvatar ? (
                <img
                  src={contactAvatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-(--talqui-text-medium)">
                  {getInitials(contactName)}
                </span>
              )}
              <span
                className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-(--talqui-green-500)"
                title={CHANNEL_LABELS[channel]}
                aria-hidden
              />
            </div>
            <h2 className="min-w-0 flex-1 truncate text-base font-bold text-(--talqui-text-strong)">
              {contactName}
            </h2>
          </div>
          {(contactEmail || contactPhone) && (
            <div className="flex flex-col gap-2">
              {contactEmail && (
                <div className="flex items-center gap-2 text-sm text-(--talqui-text-primary)">
                  <Icons.Mail size={16} className="shrink-0 text-(--talqui-text-weak)" />
                  <span className="min-w-0 truncate">{contactEmail}</span>
                  <Icons.CheckCircle size={14} className="shrink-0 text-(--talqui-green-500)" />
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center gap-2 text-sm text-(--talqui-text-primary)">
                  <Icons.Phone size={16} className="shrink-0 text-(--talqui-text-weak)" />
                  <span className="min-w-0 truncate">{contactPhone}</span>
                  <Icons.CheckCircle size={14} className="shrink-0 text-(--talqui-green-500)" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Atribuído a */}
        <CollapsibleSection
          title="Atribuído a"
          icon={Icons.User}
          open={true}
        >
          {assignedAttendant ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--talqui-bg-weaker)">
                  {assignedAttendant.avatar ? (
                    <img
                      src={assignedAttendant.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-(--talqui-text-medium)">
                      {getInitials(assignedAttendant.name)}
                    </span>
                  )}
                </div>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-(--talqui-text-strong)">
                  {assignedAttendant.name}
                </span>
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker) transition-colors duration-200 cursor-pointer"
                  aria-label="Reatribuir"
                >
                  <Icons.AddressBook size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-(--talqui-text-medium)">
                Nenhum atendente atribuído
              </p>
              <Button
                size="medium"
                variant="primary"
                className="w-full"
                onClick={onStartService}
              >
                Iniciar atendimento
              </Button>
            </div>
          )}
        </CollapsibleSection>

        {/* Tags */}
        <CollapsibleSection
          title="Tags"
          icon={Icons.Tag}
          open={false}
        >
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-(--talqui-bg-weaker) px-2.5 py-1 text-xs font-medium text-(--talqui-text-primary)"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-(--talqui-text-weak)">
              Nenhuma tag nesta conversa
            </p>
          )}
        </CollapsibleSection>

        {/* Extensões / Plugins */}
        <CollapsibleSection
          title="Extensões"
          icon={Icons.Extension}
          open={true}
        >
          {enabledExtensions.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {enabledExtensions.map((ext) => (
                <li key={ext.id}>
                  <button
                    type="button"
                    onClick={() => onUseExtension?.(ext.id)}
                    className="flex w-full items-center gap-2 rounded-(--talqui-radius-sm) px-2 py-2 text-left transition-colors duration-200 cursor-pointer hover:bg-(--talqui-bg-weaker)"
                  >
                    <img
                      src={getExtensionLogoUrl(ext)}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-(--talqui-radius-sm) object-cover bg-(--talqui-bg-weaker)"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-(--talqui-text-primary)">
                      {ext.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-(--talqui-text-weak)">
              Nenhuma extensão ativa. Ative extensões na página de Extensões para usar na conversa.
            </p>
          )}
        </CollapsibleSection>
      </div>
    </aside>
  );
}
