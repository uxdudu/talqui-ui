import { Icons } from "../../../components/icons";

export type ExtensionsViewFilter = "todas" | "instaladas";
type TabId = "todos" | "gratis" | "pago";

interface FilterBarProps {
  view: ExtensionsViewFilter;
  onViewChange: (view: ExtensionsViewFilter) => void;
  tab: TabId;
  onTabChange: (tab: TabId) => void;
  searchPlaceholder?: string;
}

export function FilterBar({
  view,
  onViewChange,
  tab,
  onTabChange,
  searchPlaceholder = "Busque pelo nome",
}: FilterBarProps) {
  const viewOptions: { id: ExtensionsViewFilter; label: string }[] = [
    { id: "todas", label: "Todas as extensões" },
    { id: "instaladas", label: "Extensões instaladas" },
  ];

  const tabs: { id: TabId; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "gratis", label: "Grátis" },
    { id: "pago", label: "Pago" },
  ];

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-[var(--talqui-radius-sm)] border border-[var(--talqui-border-weak)] bg-white p-1">
            {viewOptions.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onViewChange(v.id)}
                className={`rounded-[var(--talqui-radius-sm-inset-4)] px-3 py-2 text-sm font-semibold ${
                  view === v.id
                    ? "bg-[var(--talqui-bg-weaker)] text-[var(--talqui-text-primary)]"
                    : "text-[var(--talqui-text-medium)] hover:bg-neutral-50"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-[var(--talqui-border-weak)]" />
          <div className="flex gap-1 rounded-[var(--talqui-radius-sm)] border border-[var(--talqui-border-weak)] bg-white p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                className={`rounded-[var(--talqui-radius-sm-inset-4)] px-3 py-2 text-sm font-semibold ${
                  tab === t.id
                    ? "bg-[var(--talqui-bg-weaker)] text-[var(--talqui-text-primary)]"
                    : "text-[var(--talqui-text-medium)] hover:bg-neutral-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
        <div className="flex h-10 w-[304px] items-center gap-2 rounded-[var(--talqui-radius-sm)] border border-[var(--talqui-border-weak)] bg-white px-2 py-2">
          <span className="text-sm text-[var(--talqui-text-weak)]">
            Selecione
          </span>
          <Icons.ChevronDown
            size={24}
            className="ml-auto text-[var(--talqui-text-weak)]"
          />
        </div>
        <div className="flex h-10 w-[268px] items-center gap-2 rounded-[var(--talqui-radius-sm)] border border-[var(--talqui-border-weak)] bg-white px-2 py-2">
          <Icons.Search
            size={20}
            className="shrink-0 text-[var(--talqui-text-weak)]"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--talqui-text-strong)] placeholder:text-[var(--talqui-text-weak)] focus:outline-none"
          />
        </div>
        </div>
      </div>
    </div>
  );
}
