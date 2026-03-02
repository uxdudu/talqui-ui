import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Icons } from "../icons";

export interface KnowledgeSourceOption {
  id: string;
  nome: string;
  formato?: string;
}

interface KnowledgeSelectProps {
  sources: KnowledgeSourceOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  /** Quando true, o trigger não mostra os chips dos selecionados (útil quando a lista é exibida fora) */
  hideSelectedFromTrigger?: boolean;
  /** Tipo "add" renderiza botão com ícone + e "Adicionar conhecimento" no topo da lista */
  triggerType?: "select" | "add";
  className?: string;
}

export function KnowledgeSelect({
  sources,
  selectedIds,
  onChange,
  placeholder = "Buscar conhecimento...",
  emptyMessage = "Nenhum conhecimento adicionado",
  hideSelectedFromTrigger = false,
  triggerType = "select",
  className = "",
}: KnowledgeSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered =
    search.trim() === ""
      ? sources
      : sources.filter((s) =>
          s.nome.toLowerCase().includes(search.toLowerCase())
        );

  const toggleKnowledge = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  const selectedItems = sources.filter((s) => selectedIds.includes(s.id));

  useEffect(() => {
    if (open) {
      setSearch("");
      setHighlightedIndex(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) =>
          i < filtered.length - 1 ? i + 1 : 0
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) =>
          i > 0 ? i - 1 : filtered.length - 1
        );
        return;
      }

      if (e.key === "Enter" && filtered.length > 0) {
        e.preventDefault();
        const item = filtered[highlightedIndex];
        if (item) toggleKnowledge(item.id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, highlightedIndex]);

  useEffect(() => {
    const el = listRef.current?.querySelector(
      `[data-index="${highlightedIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  const commandBox = open && createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Selecionar conhecimento"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-weak) bg-white shadow-xl">
        <div className="flex items-center gap-2 border-b border-(--talqui-border-weak) px-4 py-3">
          <Icons.Search size={20} className="shrink-0 text-(--talqui-text-weak)" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-base text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded bg-(--talqui-bg-weaker) px-2 py-1 text-xs font-medium text-(--talqui-text-medium) sm:inline">
            Esc
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-[280px] overflow-auto p-2"
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-(--talqui-text-weak)">
              {sources.length === 0 ? emptyMessage : "Nenhum resultado encontrado"}
            </p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filtered.map((k, index) => {
                const isSelected = selectedIds.includes(k.id);
                const isHighlighted = index === highlightedIndex;
                return (
                  <button
                    key={k.id}
                    type="button"
                    data-index={index}
                    onClick={() => toggleKnowledge(k.id)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-(--talqui-radius-lg) px-3 py-2.5 text-left text-sm transition-colors ${
                      isHighlighted
                        ? "bg-(--talqui-bg-weaker)"
                        : "hover:bg-(--talqui-bg-weaker)/50"
                    } ${isSelected ? "text-(--talqui-text-primary)" : "text-(--talqui-text-strong)"}`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isSelected
                          ? "border-(--talqui-text-primary) bg-(--talqui-text-primary)"
                          : "border-(--talqui-border-normal)"
                      }`}
                    >
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M1 5L4 8L9 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{k.nome}</span>
                    {k.formato && (
                      <span className="shrink-0 rounded bg-(--talqui-bg-weaker) px-2 py-0.5 text-xs text-(--talqui-text-medium)">
                        {k.formato}
                      </span>
                    )}
                    {isSelected && (
                      <span className="shrink-0 text-xs text-(--talqui-text-primary)">
                        Selecionado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedItems.length > 0 && (
          <div className="border-t border-(--talqui-border-weak) px-4 py-2">
            <p className="mb-2 text-xs font-semibold text-(--talqui-text-weak)">
              Selecionados ({selectedItems.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedItems.map((k) => (
                <span
                  key={k.id}
                  className="inline-flex items-center gap-1 rounded-full bg-(--talqui-primary-a10) px-2.5 py-1 text-xs font-medium text-(--talqui-text-primary)"
                >
                  {k.nome}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleKnowledge(k.id);
                    }}
                    className="flex cursor-pointer items-center justify-center rounded-full p-0.5 hover:bg-(--talqui-text-primary)/20"
                    aria-label={`Remover ${k.nome}`}
                  >
                    <Icons.Close size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-(--talqui-border-weak) px-4 py-2 text-xs text-(--talqui-text-weak)">
          <kbd className="rounded bg-(--talqui-bg-weaker) px-1.5 py-0.5">↑↓</kbd> navegar
          {" · "}
          <kbd className="rounded bg-(--talqui-bg-weaker) px-1.5 py-0.5">Enter</kbd> selecionar
        </div>
      </div>
    </div>,
    document.body
  );

  const isAddTrigger = triggerType === "add";
  const triggerLabel =
    selectedItems.length === 0
      ? "Selecione conhecimento..."
      : hideSelectedFromTrigger || isAddTrigger
        ? "Adicionar conhecimento"
        : null;
  const showChipsInTrigger =
    !isAddTrigger && !hideSelectedFromTrigger && selectedItems.length > 0;

  if (isAddTrigger) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-(--talqui-radius-lg) border border-dashed border-(--talqui-border-weak) bg-white px-3 py-2.5 text-sm font-medium text-(--talqui-text-medium) transition-colors hover:border-(--talqui-border-strong) hover:bg-(--talqui-bg-weaker) hover:text-(--talqui-text-strong) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong)"
        >
          <Icons.Plus size={18} />
          {triggerLabel}
        </button>
        {commandBox}
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-[36px] w-full cursor-pointer items-center justify-between gap-2 rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:border-(--talqui-border-strong) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong)"
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {!showChipsInTrigger ? (
            <span
              className={`flex items-center gap-2 ${
                selectedItems.length === 0 ? "text-(--talqui-text-weak)" : ""
              }`}
            >
              <Icons.Search size={16} />
              {triggerLabel}
            </span>
          ) : (
            selectedItems.map((k) => (
              <span
                key={k.id}
                className="inline-flex items-center gap-1 rounded bg-(--talqui-bg-weaker) px-2 py-0.5 text-xs font-medium text-(--talqui-text-strong)"
              >
                {k.nome}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleKnowledge(k.id);
                  }}
                  className="flex cursor-pointer items-center justify-center rounded-full p-0.5 hover:bg-(--talqui-border-weak)"
                  aria-label={`Remover ${k.nome}`}
                >
                  <Icons.Close size={12} />
                </button>
              </span>
            ))
          )}
        </span>
        <Icons.ChevronDown
          size={16}
          className="shrink-0 text-(--talqui-text-medium)"
        />
      </button>

      {commandBox}
    </div>
  );
}
