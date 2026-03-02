import type { ReactNode } from "react";

/**
 * Card para gráficos no estilo da página de estatísticas.
 * Título em faixa cinza superior, conteúdo em área branca.
 */
export function ChartCard({
  title,
  children,
  legend,
}: {
  title: string;
  children: ReactNode;
  legend?: { label: string; color: string }[];
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-(--talqui-border-weak) bg-white">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-(--talqui-border-weak) bg-(--talqui-bg-weaker) px-5 py-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-(--talqui-text-medium)">
          {title}
        </h2>
      </div>
      <div className="flex min-h-[120px] flex-1 flex-col px-5 py-4">
        <div className="flex w-full flex-1 flex-col items-center justify-center">{children}</div>
        {legend && legend.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 border-t border-(--talqui-border-weak) pt-3 text-xs text-(--talqui-text-medium)">
            {legend.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
