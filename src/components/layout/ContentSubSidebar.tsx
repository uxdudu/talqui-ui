import React, { useState } from "react";
import { Icons } from "../icons";

export type ContentSubNavId =
  | "agente-virtual"
  | "procedimentos"
  | "conhecimento"
  | "performance";

const SUB_NAV_GROUPS: {
  id: string;
  label: string;
  Icon: (props: { size?: number; className?: string }) => React.ReactNode;
  items: { id: ContentSubNavId; label: string }[];
}[] = [
  {
    id: "agente-virtual",
    label: "Agente Virtual",
    Icon: Icons.IdentityCard,
    items: [],
  },
  {
    id: "conteudo",
    label: "Conteúdo",
    Icon: Icons.Document,
    items: [
      { id: "procedimentos", label: "Procedimentos" },
      { id: "conhecimento", label: "Conhecimento" },
    ],
  },
  {
    id: "analises",
    label: "Análises",
    Icon: Icons.Chart,
    items: [{ id: "performance", label: "Performance" }],
  },
];

interface ContentSubSidebarProps {
  /** Item ativo (ex.: "procedimentos") */
  activeId?: ContentSubNavId;
  /** Chamado ao clicar em um subitem */
  onNavigate?: (id: ContentSubNavId) => void;
}

/**
 * Sub-sidebar da área Conteúdo (Procedimentos, Conhecimento, etc.).
 * Mesmo padrão DOM da nav de configuração de extensão: w-[252px], border-r, bg-(--talqui-bg-base).
 * Fica dentro da área de conteúdo da página, não substitui a Sidebar global.
 */
export function ContentSubSidebar({
  activeId = "procedimentos",
  onNavigate,
}: ContentSubSidebarProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["conteudo"]));

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <nav
      className="flex w-[252px] shrink-0 flex-col gap-1 self-stretch overflow-auto border-r border-(--talqui-border-weak) bg-(--talqui-bg-base) px-[18px] py-4"
      aria-label="Navegação Conteúdo"
    >
      {SUB_NAV_GROUPS.map((group) => {
        const isExpanded = expanded.has(group.id);
        const hasItems = group.items.length > 0;

        if (!hasItems) {
          const navId = group.id as ContentSubNavId;
          const isActive = activeId === navId;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onNavigate?.(navId)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex h-10 min-h-[44px] w-full cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg) px-3 py-3 text-left text-sm font-semibold leading-5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 ${
                isActive
                  ? "bg-(--talqui-bg-weaker) text-(--talqui-text-primary)"
                  : "text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker)"
              }`}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-(--talqui-text-primary)"
                  aria-hidden
                />
              )}
              <group.Icon size={20} className="shrink-0 opacity-80" />
              {group.label}
            </button>
          );
        }

        return (
          <div key={group.id} className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => toggle(group.id)}
              className="flex h-10 min-h-[44px] w-full cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg) px-3 py-3 text-left text-sm font-semibold leading-5 text-(--talqui-text-strong) transition-colors duration-200 hover:bg-(--talqui-bg-weaker) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2"
            >
              <group.Icon size={20} className="shrink-0 opacity-80" />
              <span className="min-w-0 flex-1 truncate">{group.label}</span>
              <Icons.ChevronDown
                size={16}
                className={`shrink-0 text-(--talqui-text-weak) transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
            {isExpanded &&
              group.items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate?.(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex h-10 min-h-[44px] w-full cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg) py-3 pl-10 pr-3 text-left text-sm font-semibold leading-5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 ${
                      isActive
                        ? "bg-(--talqui-bg-weaker) text-(--talqui-text-primary)"
                        : "text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker)"
                    }`}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-(--talqui-text-primary)"
                        aria-hidden
                      />
                    )}
                    {item.label}
                  </button>
                );
              })}
          </div>
        );
      })}
    </nav>
  );
}
