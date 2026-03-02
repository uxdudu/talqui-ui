import { Icons } from "../../../components/icons";

export type KnowledgeViewMode = "list" | "cards";

interface KnowledgeToolbarProps {
  searchPlaceholder?: string;
  totalCount: number;
  viewMode?: KnowledgeViewMode;
  onViewModeChange?: (mode: KnowledgeViewMode) => void;
  onSearchChange?: (value: string) => void;
  onAddDocument?: () => void;
}

export function KnowledgeToolbar({
  searchPlaceholder = "Pesquisar fontes de conhecimento...",
  totalCount,
  viewMode = "list",
  onViewModeChange,
  onSearchChange,
  onAddDocument,
}: KnowledgeToolbarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-10 min-w-[280px] max-w-md flex-1 items-center gap-2 rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-white px-3 py-2">
          <Icons.Search size={20} className="shrink-0 text-(--talqui-text-weak)" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:outline-none"
          />
        </div>
        <span className="shrink-0 text-sm font-medium text-(--talqui-text-medium)">
          {totalCount} fonte{totalCount !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-white p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange?.("list")}
            title="Visualização em lista"
            aria-label="Visualização em lista"
            aria-pressed={viewMode === "list"}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-(--talqui-radius-sm-inset-2) transition-colors duration-200 ${
              viewMode === "list"
                ? "bg-(--talqui-bg-weaker) text-(--talqui-text-primary)"
                : "text-(--talqui-text-weak) hover:bg-(--talqui-bg-weaker) hover:text-(--talqui-text-medium)"
            }`}
          >
            <Icons.ListView size={20} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange?.("cards")}
            title="Visualização em cards"
            aria-label="Visualização em cards"
            aria-pressed={viewMode === "cards"}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-(--talqui-radius-sm-inset-2) transition-colors duration-200 ${
              viewMode === "cards"
                ? "bg-(--talqui-bg-weaker) text-(--talqui-text-primary)"
                : "text-(--talqui-text-weak) hover:bg-(--talqui-bg-weaker) hover:text-(--talqui-text-medium)"
            }`}
          >
            <Icons.GridView size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAddDocument}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-sm) bg-(--talqui-text-primary) px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:opacity-90"
        >
          <Icons.Plus size={20} />
          Adicionar conhecimento
        </button>
      </div>
    </div>
  );
}
