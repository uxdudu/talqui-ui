import { Icons } from "../../../components/icons";

export type InboxTabId = "robo" | "fila" | "atendendo";

interface InboxTabsProps {
  activeTab: InboxTabId;
  onTabChange: (tab: InboxTabId) => void;
}

const tabs: { id: InboxTabId; label: string }[] = [
  { id: "robo", label: "Robô" },
  { id: "fila", label: "Fila" },
  { id: "atendendo", label: "Atendendo" },
];

export function InboxTabs({ activeTab, onTabChange }: InboxTabsProps) {
  return (
    <div className="flex shrink-0 w-full items-center justify-between gap-4 border-b border-[var(--talqui-border-weak)] bg-white px-4 py-3">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "text-[var(--talqui-text-primary)]"
                : "text-[var(--talqui-text-medium)] hover:text-[var(--talqui-text-strong)]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--talqui-text-primary)]"
                aria-hidden
              />
            )}
          </button>
        ))}
      </div>
      <button
        type="button"
        title="Filtrar"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--talqui-radius-lg)] text-[var(--talqui-text-medium)] hover:bg-[var(--talqui-bg-weaker)] transition-colors duration-200 cursor-pointer"
      >
        <Icons.Filter size={20} className="opacity-80" />
      </button>
    </div>
  );
}
