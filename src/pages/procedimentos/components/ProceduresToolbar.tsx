import { Icons } from "../../../components/icons";

interface ProceduresToolbarProps {
  searchPlaceholder?: string;
  totalCount: number;
  onSearchChange?: (value: string) => void;
  onNewProcedure?: () => void;
}

export function ProceduresToolbar({
  searchPlaceholder = "Pesquisar procedimentos...",
  totalCount,
  onSearchChange,
  onNewProcedure,
}: ProceduresToolbarProps) {
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
          {totalCount} procedimento{totalCount !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          title="Filtrar"
          className="flex h-10 w-10 items-center justify-center rounded-(--talqui-radius-lg) text-(--talqui-text-medium) transition-colors duration-200 hover:bg-(--talqui-bg-weaker) cursor-pointer"
        >
          <Icons.Filter size={20} className="opacity-80" />
        </button>
        <button
          type="button"
          onClick={onNewProcedure}
          className="flex items-center gap-2 rounded-(--talqui-radius-sm) bg-(--talqui-text-primary) px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:opacity-90 cursor-pointer"
        >
          <Icons.Plus size={20} />
          Novo procedimento
        </button>
      </div>
    </div>
  );
}
