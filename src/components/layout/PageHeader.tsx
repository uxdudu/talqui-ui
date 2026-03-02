interface PageHeaderProps {
  /** Título exibido no header (ex.: "Extensões", "Procedimentos"). */
  title: string;
}

/**
 * Header padrão das páginas Talqui.
 * Exibir no topo da área principal em todas as páginas, exceto subvisões fullscreen e a página de conversas.
 * Classe do header: min-h-[60px] max-h-16, border-b, bg-white — manter para consistência de layout.
 */
export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="flex min-h-[60px] max-h-16 w-full shrink-0 items-center justify-between gap-4 border-b border-[var(--talqui-border-weak)] bg-white px-4 py-1">
      <h1 className="truncate text-base font-bold leading-6 text-[var(--talqui-text-medium)]">
        {title}
      </h1>
    </header>
  );
}
