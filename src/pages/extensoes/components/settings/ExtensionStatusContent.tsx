import { useState } from "react";
import type { Extension } from "../../data";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";
import {
  getExtensionStatusData,
  HISTORY_MONTHS,
  type BarStatus,
  type BarDayTooltip,
  type ExtensionStatusData,
} from "./extension-status-data";

interface ExtensionStatusContentProps {
  extension: Extension;
}

function BarChart({
  bars,
  barTooltips,
}: {
  bars: BarStatus[];
  barTooltips?: BarDayTooltip[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tooltip = hoveredIndex != null && barTooltips?.[hoveredIndex];
  const showTooltip = tooltip !== undefined && tooltip !== null;

  return (
    <div className="relative w-full">
      <div className="flex gap-px" role="img" aria-label="Histórico de status">
        {bars.map((s, i) => (
          <button
            key={i}
            type="button"
            className={`h-6 min-w-[4px] flex-1 rounded-sm transition-opacity ${
              s === "ok"
                ? "bg-(--talqui-green-500)"
                : s === "degraded"
                  ? "bg-amber-400"
                  : "bg-red-500"
            } ${hoveredIndex === i ? "ring-2 ring-(--talqui-text-strong) ring-offset-1" : ""}`}
            style={{ minWidth: 4 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            title={
              barTooltips?.[i]
                ? barTooltips[i].incidents?.length
                  ? `${barTooltips[i].dateLabel}: ${barTooltips[i].incidents!.map((x) => x.title).join("; ")}`
                  : barTooltips[i].dateLabel
                : s === "ok"
                  ? "Operacional"
                  : s === "degraded"
                    ? "Degradado"
                    : "Indisponível"
            }
            aria-label={`Dia ${barTooltips?.[i]?.dateLabel ?? i + 1}: ${s === "ok" ? "Operacional" : s === "degraded" ? "Degradado" : "Indisponível"}`}
          />
        ))}
      </div>
      {/* Tooltip ao passar o mouse em qualquer barra (dia) */}
      {showTooltip && tooltip && (
        <div
          className="absolute z-10 min-w-[200px] max-w-[320px] rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white px-3 py-2.5 shadow-lg"
          style={{
            bottom: "100%",
            left: `${((hoveredIndex + 0.5) / bars.length) * 100}%`,
            transform: "translate(-50%, -8px)",
          }}
          role="tooltip"
        >
          <p className="text-xs font-medium text-(--talqui-text-weak)">
            {tooltip.dateLabel}
          </p>
          {tooltip.incidents?.length ? (
            <div className="mt-1.5 flex gap-2">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600"
                aria-hidden
              >
                <span className="text-xs font-bold leading-none">!</span>
              </span>
              <div className="flex flex-col gap-0.5">
                {tooltip.incidents.map((inc, j) => (
                  <p key={j} className="text-sm font-semibold text-(--talqui-text-strong)">
                    {inc.title}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-(--talqui-text-medium)">
              {hoveredIndex != null && bars[hoveredIndex] === "degraded"
                ? "Degradação parcial neste dia"
                : hoveredIndex != null && bars[hoveredIndex] === "outage"
                  ? "Indisponibilidade neste dia"
                  : "Operacional"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function ExtensionStatusContent({ extension }: ExtensionStatusContentProps) {
  const [view, setView] = useState<"status" | "history">("status");
  const data: ExtensionStatusData = getExtensionStatusData(extension.id);

  const bannerConfig = {
    operational: {
      label: "Todos os sistemas operacionais",
      sublabel: "Não há incidentes conhecidos afetando esta extensão.",
      className: "bg-(--talqui-green-a10) border-(--talqui-green-500/30)",
      icon: "text-(--talqui-green-500)",
    },
    degraded: {
      label: "Degradação parcial",
      sublabel: "Alguns serviços podem estar lentos ou com falhas intermitentes.",
      className: "bg-amber-50 border-amber-300",
      icon: "text-amber-600",
    },
    outage: {
      label: "Indisponibilidade",
      sublabel: "Há uma interrupção afetando esta extensão.",
      className: "bg-red-50 border-red-300",
      icon: "text-red-600",
    },
  };

  const banner = bannerConfig[data.overall];

  if (view === "history") {
    return (
      <div className="flex max-w-[720px] flex-col gap-6" id="status">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
            Histórico de incidentes
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("status")}
              className="text-sm font-semibold text-(--talqui-text-primary) hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 rounded"
            >
              ‹ Voltar ao status
            </button>
          </div>
        </div>

        <p className="text-sm text-(--talqui-text-medium)">
          Registro de incidentes da API da extensão {extension.name}. Use este histórico para
          verificar se falhas na integração foram causadas por indisponibilidade do provedor.
        </p>

        <div className="flex flex-col gap-8">
          {HISTORY_MONTHS.map((month) => {
            const incidents = data.incidentsByMonth[month.id] ?? [];
            return (
              <section key={month.id} className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-(--talqui-text-strong)">
                  {month.label}
                </h3>
                {incidents.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-(--talqui-bg-weaker) px-4 py-3">
                    <Icons.CheckCircle size={20} className="shrink-0 text-(--talqui-green-500)" />
                    <span className="text-sm font-medium text-(--talqui-text-medium)">
                      Nenhum incidente registrado.
                    </span>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {incidents.map((inc) => (
                      <li
                        key={inc.id}
                        className="flex gap-3 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-4 py-4"
                      >
                        <span
                          className="h-full w-1 shrink-0 rounded-full bg-amber-400"
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-(--talqui-text-strong)">
                            {inc.title}
                          </p>
                          <p className="mt-1 text-sm text-(--talqui-text-medium)">
                            {inc.resolution}
                          </p>
                          <p className="mt-2 text-xs text-(--talqui-text-weak)">
                            {inc.dayLabel} · {inc.time}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[720px] flex-col gap-6" id="status">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
            Status da API
          </h2>
          <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
            Status dos sistemas da extensão {extension.name}. Em caso de falhas na integração,
            verifique aqui se houve incidentes do lado do provedor.
          </p>
        </div>
        <Button
          size="medium"
          variant="secondary"
          onClick={() => setView("history")}
          className="shrink-0"
        >
          <Icons.Calendar size={18} className="mr-1.5 shrink-0" />
          Ver histórico
        </Button>
      </div>

      {/* Banner geral */}
      <div
        className={`flex items-start gap-3 rounded-(--talqui-radius-xl) border px-4 py-4 ${banner.className}`}
      >
        <Icons.CheckCircle size={24} className={`shrink-0 ${banner.icon}`} />
        <div>
          <p className="text-sm font-semibold leading-5 text-(--talqui-text-strong)">
            {banner.label}
          </p>
          <p className="mt-0.5 text-sm text-(--talqui-text-medium)">
            {banner.sublabel}
          </p>
        </div>
      </div>

      {/* Status por componente */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold leading-6 text-(--talqui-text-strong)">
            Status dos sistemas
          </h3>
          <span className="text-sm text-(--talqui-text-weak)">
            {data.dateRangeLabel}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {data.components.map((comp) => (
            <div
              key={comp.id}
              className="flex flex-col gap-2 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-(--talqui-bg-base) p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle size={20} className="shrink-0 text-(--talqui-green-500)" />
                  <span className="text-sm font-semibold text-(--talqui-text-strong)">
                    {comp.name}
                  </span>
                  {comp.componentCount != null && (
                    <span className="text-xs text-(--talqui-text-weak)">
                      {comp.componentCount} componentes
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-(--talqui-text-strong)">
                  {comp.uptime.toFixed(2)}% uptime
                </span>
              </div>
              <BarChart bars={comp.bars} barTooltips={comp.barTooltips} />
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs leading-5 text-(--talqui-text-weak)">
        Verde: operacional · Amarelo: degradado · Vermelho: indisponível. Os dados são
        informativos e referem-se aos sistemas do provedor da extensão.
      </p>
    </div>
  );
}
