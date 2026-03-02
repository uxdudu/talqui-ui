import { useMemo, useState } from "react";
import { Icons } from "../../components/icons";
import {
  DateRangePicker,
  getDefaultDateRange,
  type DateRange,
} from "../../components/ui/DateRangePicker";

export type { DateRange };

type EstatisticasTab = "overview" | "operadores" | "conversas";

const VOLUME_HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

function formatPeriodLabel(range: DateRange): string {
  return `${range.from.getDate()} ${range.from.toLocaleDateString("pt-BR", {
    month: "short",
  })} – ${range.to.getDate()} ${range.to.toLocaleDateString("pt-BR", {
    month: "short",
  })}`;
}

const VOLUME_LEGEND = [
  { label: "Minoria", color: "#60a5fa" },
  { label: "Equilíbrio", color: "#f97316" },
  { label: "Maioria", color: "#22c55e" },
];

type SummaryData = {
  atendimentosTotal: number;
  atendimentosAnterior: number;
  tempoMedioSegundos: number;
  tempoMedioAnteriorSegundos: number;
  novosContatosTotal: number;
  novosContatosAnterior: number;
};

type ActivityData = {
  dias: string[];
  atual: number[];
  anterior: number[];
};

type VolumeData = {
  porHora: { hour: string; value: number }[];
};

type LeaderboardItem = {
  nome: string;
  valor: number;
  avatarUrl?: string | null;
};

type HorizontalItem = {
  label: string;
  value: number;
  isAi?: boolean;
  avatarUrl?: string | null;
};

type PeriodMockData = {
  summary: SummaryData;
  activity: ActivityData;
  volume: VolumeData;
  leaderboard: LeaderboardItem[];
  operadores: HorizontalItem[];
  motivos: HorizontalItem[];
  canais: HorizontalItem[];
};

const ORANGE_BASE = "#f97316";
const ORANGE_DARK = "#ea580c";

const BASE_ACTIVITY_ATUAL = [52, 68, 75, 61, 90, 72, 40];
const BASE_ACTIVITY_ANTERIOR = [48, 60, 70, 55, 80, 65, 36];

const BASE_VOLUME_VALORES = VOLUME_HOURS.map((_, index) => 40 + (index % 6) * 8);

const BASE_LEADERBOARD: LeaderboardItem[] = [
  { nome: "João Silva", valor: 180 },
  { nome: "Maria Souza", valor: 165 },
  { nome: "Ana Paula", valor: 140 },
  { nome: "Carlos Eduardo", valor: 110 },
  { nome: "Fernanda Lima", valor: 95 },
];

const BASE_OPERADORES: HorizontalItem[] = [
  { label: "João Silva", value: 180 },
  { label: "Maria Souza", value: 165 },
  { label: "Ana Paula", value: 140 },
  { label: "Carlos Eduardo", value: 110 },
  { label: "Fernanda Lima", value: 95 },
  { label: "Equipe IA", value: 220, isAi: true },
];

const BASE_MOTIVOS: HorizontalItem[] = [
  { label: "Dúvidas sobre produto", value: 210 },
  { label: "Problemas técnicos", value: 190 },
  { label: "Financeiro / boletos", value: 160 },
  { label: "Onboarding", value: 120 },
  { label: "Cancelamento", value: 80 },
];

const BASE_CANAIS: HorizontalItem[] = [
  { label: "WhatsApp", value: 260 },
  { label: "Chat do site", value: 180 },
  { label: "Instagram", value: 120 },
  { label: "Facebook", value: 60 },
];

function getScaleFromDateRange(range: DateRange): number {
  const now = new Date();
  const daysSinceEnd = (now.getTime() - range.to.getTime()) / (24 * 60 * 60 * 1000);
  return Math.max(0.6, Math.min(1, 1 - (daysSinceEnd / 90) * 0.4));
}

function buildMockDataForDateRange(range: DateRange): PeriodMockData {
  const scale = getScaleFromDateRange(range);

  const activityAtual = BASE_ACTIVITY_ATUAL.map((v) => Math.round(v * scale));
  const activityAnterior = BASE_ACTIVITY_ANTERIOR.map((v) => Math.round(v * scale * 0.9));
  const totalAtual = activityAtual.reduce((sum, v) => sum + v, 0);
  const totalAnterior = activityAnterior.reduce((sum, v) => sum + v, 0);

  const volume: VolumeData = {
    porHora: VOLUME_HOURS.map((hour, index) => ({
      hour,
      value: Math.round(BASE_VOLUME_VALORES[index] * (0.7 + scale * 0.5)),
    })),
  };

  const leaderboard = BASE_LEADERBOARD.map((item) => ({
    ...item,
    valor: Math.round(item.valor * scale),
  }));

  const operadores = BASE_OPERADORES.map((item) => ({
    ...item,
    value: Math.round(item.value * scale),
  }));

  const motivos = BASE_MOTIVOS.map((item) => ({
    ...item,
    value: Math.round(item.value * scale),
  }));

  const canais = BASE_CANAIS.map((item) => ({
    ...item,
    value: Math.round(item.value * scale),
  }));

  const tempoMedioSegundos = Math.round(160 - 20 * scale);
  const tempoMedioAnteriorSegundos = Math.round(190 - 15 * scale);

  const summary: SummaryData = {
    atendimentosTotal: totalAtual,
    atendimentosAnterior: totalAnterior,
    tempoMedioSegundos,
    tempoMedioAnteriorSegundos,
    novosContatosTotal: Math.round(totalAtual * 0.35),
    novosContatosAnterior: Math.round(totalAnterior * 0.32),
  };

  const activity: ActivityData = {
    dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    atual: activityAtual,
    anterior: activityAnterior,
  };

  return {
    summary,
    activity,
    volume,
    leaderboard,
    operadores,
    motivos,
    canais,
  };
}

function Tabs({
  value,
  onChange,
}: {
  value: EstatisticasTab;
  onChange: (tab: EstatisticasTab) => void;
}) {
  const tabs: { id: EstatisticasTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "operadores", label: "Operadores" },
    { id: "conversas", label: "Conversas" },
  ];

  return (
    <nav
      aria-label="Seções de estatísticas"
      className="flex items-center gap-1 rounded-full border border-[var(--talqui-border-weak)] bg-white p-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              "cursor-pointer rounded-full px-3 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "bg-[var(--talqui-bg-weaker)] text-[var(--talqui-text-primary)]"
                : "text-[var(--talqui-text-medium)] hover:bg-neutral-50",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (rest === 0) return `${minutes}min`;
  return `${minutes}min ${rest}s`;
}

function MetricCard({
  label,
  currentText,
  previousText,
  currentValue,
  previousValue,
  goodWhenHigher = true,
  trend,
}: {
  label: string;
  currentText: string;
  previousText: string;
  currentValue: number;
  previousValue: number;
  goodWhenHigher?: boolean;
  trend?: number[];
}) {
  const rawDiff = currentValue - previousValue;
  const percent = previousValue > 0 ? (rawDiff / previousValue) * 100 : 0;
  const isImprovement = goodWhenHigher ? rawDiff >= 0 : rawDiff <= 0;
  const sign = percent === 0 ? "" : percent > 0 ? "+" : "";
  const percentText = `${sign}${percent.toFixed(1)}%`;

  const trendValues = trend && trend.length ? trend : [3, 6, 4, 7, 5];
  const maxTrend = Math.max(...trendValues, 1);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-(--talqui-border-weak) bg-(--talqui-bg-weaker)">
      <div className="flex items-start justify-between gap-4 rounded-[12px] bg-(--talqui-bg-base) px-5 pt-4 pb-3">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-(--talqui-text-medium)">
            {label}
          </span>
          <span className="text-[30px] font-semibold leading-tight text-(--talqui-text-strong)">
            {currentText}
          </span>
        </div>
        <div className="mt-1 flex h-10 w-10 items-end justify-between gap-[2px]">
          {trendValues.slice(-5).map((value, index) => {
            const heightPct = (value / maxTrend) * 100;
            const minHeight = 18;
            const h = Math.max(heightPct, minHeight);
            const opacity = 0.35 + (index / 4) * 0.35;
            return (
              <span
                key={index}
                className="w-[2px] rounded-full"
                style={{
                  height: `${h}%`,
                  backgroundColor: `rgba(15,23,42,${opacity})`,
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-[11px]">
        <div className="flex items-center gap-2 text-(--talqui-text-medium)">
          <span
            className={[
              "flex h-5 w-5 items-center justify-center rounded-full",
              isImprovement
                ? "bg-emerald-500 text-white"
                : "border border-red-200 bg-white text-red-600",
            ].join(" ")}
          >
            {isImprovement ? (
              <Icons.ChevronUp size={12} className="-translate-y-[1px]" />
            ) : (
              <Icons.ChevronDown size={12} className="translate-y-[1px]" />
            )}
          </span>
          <span>{previousText} na semana anterior</span>
        </div>
        {previousValue > 0 && (
          <span
            className={
              isImprovement ? "font-medium text-emerald-600" : "font-medium text-red-600"
            }
          >
            {percentText}
          </span>
        )}
      </div>
    </article>
  );
}

function CardShell({
  title,
  children,
  headerRight,
  footer,
  variant,
}: {
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "standard" | "chart";
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-(--talqui-border-weak) bg-(--talqui-bg-weaker)">
      {variant === "chart" ? (
        <>
          <div className="flex shrink-0 items-center justify-between gap-4 px-5 py-3">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-(--talqui-text-medium)">
              {title}
            </h2>
            {headerRight && (
              <div className="text-[11px] text-(--talqui-text-medium)">{headerRight}</div>
            )}
          </div>
          <div className="min-h-[160px] flex-1 rounded-[12px] bg-white px-5 py-4">{children}</div>
        </>
      ) : (
        <>
          <header className="flex items-center justify-between gap-4 px-5 pt-3 pb-3">
            <h2 className="text-sm font-medium leading-5 text-(--talqui-text-strong)">{title}</h2>
            {headerRight}
          </header>
          <div className="min-h-[160px] flex-1 rounded-[12px] bg-white px-5 pt-4 pb-4 h-fit">{children}</div>
        </>
      )}
      {footer && !variant && (
        <div className="-mx-5 -mb-4 mt-1 border-t border-(--talqui-border-weak) bg-(--talqui-bg-weaker) px-4 py-2.5 text-[11px] text-(--talqui-text-medium)">
          {footer}
        </div>
      )}
    </section>
  );
}

function ActivityComparisonChart({ activity }: { activity: ActivityData }) {
  const max = Math.max(...activity.atual, ...activity.anterior, 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-3 text-[10px] text-(--talqui-text-medium)">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
          Semana anterior
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ORANGE_BASE }} aria-hidden />
          Semana atual
        </span>
      </div>
      <div className="relative flex h-40 items-end gap-3 rounded-(--talqui-radius-lg) bg-white px-4 py-4">
        <div className="pointer-events-none absolute inset-x-4 top-4 bottom-4 flex flex-col justify-between">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <div
              key={t}
              className="border-t border-dashed border-(--talqui-border-weak)"
            />
          ))}
        </div>
        {activity.dias.map((dia, index) => {
          const anteriorPct = (activity.anterior[index] / max) * 100;
          const atualPct = (activity.atual[index] / max) * 100;
          return (
            <div key={dia} className="relative flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end gap-1">
                <div
                  className="flex-1 rounded-full bg-slate-200"
                  style={{ height: `${Math.max(anteriorPct, 8)}%` }}
                />
                <div
                  className="flex-1 rounded-full"
                  style={{
                    height: `${Math.max(atualPct, 6)}%`,
                    background: `linear-gradient(to top, ${ORANGE_DARK}, ${ORANGE_BASE})`,
                  }}
                />
              </div>
              <span className="text-[10px] font-medium text-(--talqui-text-medium)">{dia}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
}

function LeaderboardChart({ items }: { items: LeaderboardItem[] }) {
  const max = Math.max(...items.map((i) => i.valor), 1);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const pct = (item.valor / max) * 100;
        return (
          <div key={item.nome} className="flex items-start gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full ${getAvatarColor(item.nome)}`}
            >
              {item.avatarUrl ? (
                <img
                  src={item.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold">
                  {getInitials(item.nome)}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2 text-xs text-(--talqui-text-medium)">
                <span className="truncate">{item.nome}</span>
                <span className="shrink-0 text-(--talqui-text-strong)">
                  {item.valor.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-(--talqui-bg-weaker)">
                <div
                  className="h-full rounded-full bg-emerald-500/90"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PIE_CHART_COLORS = [
  "#25D366", // WhatsApp green
  "#007aff", // Chat blue
  "#E4405F", // Instagram pink
  "#1877F2", // Facebook blue
  "#6366f1", // fallback indigo
  "#f97316", // fallback orange
];

function PieChart({ items }: { items: HorizontalItem[] }) {
  const total = items.reduce((sum, i) => sum + i.value, 0) || 1;
  const segments = items.map((item, index) => ({
    ...item,
    pct: (item.value / total) * 100,
    color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
  }));

  const conicStops = segments.reduce<{ deg: number; color: string }[]>(
    (acc, seg, i) => {
      const prevDeg = acc[i - 1]?.deg ?? 0;
      acc.push({ deg: prevDeg + (seg.pct / 100) * 360, color: seg.color });
      return acc;
    },
    []
  );

  const gradient = conicStops
    .map((s, i) => {
      const prev = conicStops[i - 1];
      const start = prev ? prev.deg : 0;
      return `${s.color} ${start}deg ${s.deg}deg`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="h-40 w-40 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      />
      <div className="flex min-w-0 flex-1 flex-wrap gap-x-4 gap-y-2">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="flex items-center gap-2 text-xs text-(--talqui-text-medium)"
          >
            <span
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: seg.color }}
              aria-hidden
            />
            <span className="truncate">{seg.label}</span>
            <span className="font-medium text-(--talqui-text-strong)">
              {seg.value.toLocaleString("pt-BR")}
            </span>
            <span className="text-(--talqui-text-weak)">
              ({seg.pct.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBarList({
  items,
  showAvatar,
}: {
  items: HorizontalItem[];
  showAvatar?: boolean;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const pct = (item.value / max) * 100;
        return (
          <div
            key={item.label}
            className={showAvatar ? "flex items-start gap-3" : "flex flex-col gap-1"}
          >
            {showAvatar && (
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full ${getAvatarColor(item.label)}`}
              >
                {item.avatarUrl ? (
                  <img
                    src={item.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold">
                    {getInitials(item.label)}
                  </span>
                )}
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2 text-xs text-(--talqui-text-medium)">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate">{item.label}</span>
                  {item.isAi && (
                    <span className="shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                      IA
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-(--talqui-text-strong)">
                  {item.value.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-(--talqui-bg-weaker)">
                <div
                  className={[
                    "h-full rounded-full transition-all",
                    item.isAi ? "bg-gradient-to-r from-indigo-500 to-sky-400" : "bg-sky-500/90",
                  ].join(" ")}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OverviewTab({
  summary,
  activity,
  volume,
  leaderboard,
  periodLabel,
}: {
  summary: SummaryData;
  activity: ActivityData;
  volume: VolumeData;
  leaderboard: LeaderboardItem[];
  periodLabel: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Atendimentos"
          currentText={summary.atendimentosTotal.toLocaleString("pt-BR")}
          previousText={summary.atendimentosAnterior.toLocaleString("pt-BR")}
          currentValue={summary.atendimentosTotal}
          previousValue={summary.atendimentosAnterior}
          goodWhenHigher
          trend={activity.atual}
        />

        <MetricCard
          label="Tempo médio de atendimento"
          currentText={formatSeconds(summary.tempoMedioSegundos)}
          previousText={formatSeconds(summary.tempoMedioAnteriorSegundos)}
          currentValue={summary.tempoMedioSegundos}
          previousValue={summary.tempoMedioAnteriorSegundos}
          goodWhenHigher={false}
          trend={activity.atual.map((v) => Math.max(1, 100 - v))}
        />

        <MetricCard
          label="Novos contatos"
          currentText={summary.novosContatosTotal.toLocaleString("pt-BR")}
          previousText={summary.novosContatosAnterior.toLocaleString("pt-BR")}
          currentValue={summary.novosContatosTotal}
          previousValue={summary.novosContatosAnterior}
          goodWhenHigher
          trend={activity.atual.map((v) => Math.round(v * 0.4))}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <CardShell
          title="Atividade da semana atual comparada com a da semana anterior"
          headerRight={null}
          variant="chart"
        >
          <ActivityComparisonChart activity={activity} />
        </CardShell>

        <CardShell
          title="Quadro de liderança"
          headerRight={null}
          variant="chart"
        >
          <LeaderboardChart items={leaderboard} />
        </CardShell>
      </div>

      <CardShell
        title="Volume de conversas"
        headerRight={null}
        variant="chart"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-(--talqui-text-medium)">
              <span className="font-semibold text-(--talqui-text-strong)">
                {volume.porHora.reduce((s, v) => s + v.value, 0).toLocaleString("pt-BR")}
              </span>{" "}
              conversas no período {periodLabel}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-(--talqui-text-medium)">
              {VOLUME_LEGEND.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden
                  />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="relative flex h-40 items-end gap-[3px] overflow-hidden rounded-(--talqui-radius-lg) bg-white px-3 py-4">
              <div className="pointer-events-none absolute inset-x-3 top-4 bottom-4 flex flex-col justify-between">
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                  <div
                    key={t}
                    className="border-t border-dashed border-(--talqui-border-weak)"
                  />
                ))}
              </div>
              {(() => {
                const max = Math.max(...volume.porHora.map((v) => v.value), 1);
                const sorted = [...volume.porHora].sort((a, b) => a.value - b.value);
                const p33 = sorted[Math.floor(sorted.length * 0.33)]?.value ?? 0;
                const p66 = sorted[Math.floor(sorted.length * 0.66)]?.value ?? max;
                const getColor = (value: number) => {
                  if (value <= p33) return VOLUME_LEGEND[0].color;
                  if (value <= p66) return VOLUME_LEGEND[1].color;
                  return VOLUME_LEGEND[2].color;
                };
                const rows = 8;
                return volume.porHora.map((item) => {
                  const filled = Math.max(
                    1,
                    Math.round((item.value / max) * rows)
                  );
                  const color = getColor(item.value);
                  return (
                    <div
                      key={item.hour}
                      className="flex flex-1 items-end justify-center"
                      title={`${item.hour}: ${item.value} conversas`}
                    >
                      <div className="flex flex-col-reverse gap-[2px]">
                        {Array.from({ length: rows }).map((_, rowIdx) => {
                          const isActive = rowIdx < filled;
                          return (
                            <div
                              key={rowIdx}
                              className="h-[8px] w-[8px] rounded-[2px]"
                              style={{
                                backgroundColor: isActive
                                  ? color
                                  : "rgba(148,163,184,0.2)",
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="flex justify-between text-[10px] text-(--talqui-text-weak)">
              {VOLUME_HOURS.filter((_, index) => index % 4 === 0).map((hour) => (
                <span key={hour}>{hour}</span>
              ))}
            </div>
          </div>
        </div>
      </CardShell>
    </div>
  );
}

function FilterCard({ title }: { title: string }) {
  return (
    <aside className="flex h-full flex-col gap-3 rounded-2xl border border-(--talqui-border-weak) bg-white px-5 py-4 text-xs text-(--talqui-text-medium)">
      <h3 className="text-sm font-semibold text-(--talqui-text-strong)">{title}</h3>
      <p>Em breve você poderá filtrar por múltiplos itens aqui.</p>
    </aside>
  );
}

function OperadoresTab({ operadores }: { operadores: HorizontalItem[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <CardShell
        title="Atendimentos realizados por cada operador"
        headerRight={null}
      >
        <HorizontalBarList items={operadores} showAvatar />
      </CardShell>
      <FilterCard title="Filtrar por operador" />
    </div>
  );
}

function ConversasTab({
  motivos,
  canais,
}: {
  motivos: HorizontalItem[];
  canais: HorizontalItem[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <CardShell
          title="Motivos de atendimento"
          headerRight={null}
        >
          <HorizontalBarList items={motivos} />
        </CardShell>
        <FilterCard title="Filtrar por motivo" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <CardShell
          title="Atendimentos realizados por cada canal"
          headerRight={null}
        >
          <PieChart items={canais} />
        </CardShell>
        <FilterCard title="Filtrar por canal" />
      </div>
    </div>
  );
}

/**
 * Hook para controlar o período exibido nas estatísticas.
 * Retorna o intervalo de datas atual, a função para alterá-lo e o label formatado.
 */
export function useEstatisticasPeriod(initialRange?: DateRange) {
  const [dateRange, setDateRange] = useState<DateRange>(
    initialRange ?? getDefaultDateRange()
  );
  const periodLabel = formatPeriodLabel(dateRange);
  return { dateRange, setDateRange, periodLabel };
}

export interface EstatisticasContentProps {
  /** Intervalo de datas (modo controlado). Quando omitido, usa estado interno. */
  dateRange?: DateRange;
  /** Callback ao alterar o intervalo (modo controlado). */
  onDateRangeChange?: (range: DateRange) => void;
}

export function EstatisticasContent({
  dateRange: controlledRange,
  onDateRangeChange,
}: EstatisticasContentProps = {}) {
  const [tab, setTab] = useState<EstatisticasTab>("overview");
  const [internalRange, setInternalRange] = useState<DateRange>(getDefaultDateRange());
  const isControlled = controlledRange !== undefined && onDateRangeChange !== undefined;
  const dateRange = isControlled ? controlledRange : internalRange;
  const setDateRange = isControlled ? onDateRangeChange : setInternalRange;

  const periodData = useMemo(
    () => buildMockDataForDateRange(dateRange),
    [dateRange.from.getTime(), dateRange.to.getTime()]
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={tab} onChange={setTab} />
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-(--talqui-text-medium)">
            Período
          </span>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {tab === "overview" && (
        <OverviewTab
          summary={periodData.summary}
          activity={periodData.activity}
          volume={periodData.volume}
          leaderboard={periodData.leaderboard}
          periodLabel={formatPeriodLabel(dateRange)}
        />
      )}
      {tab === "operadores" && <OperadoresTab operadores={periodData.operadores} />}
      {tab === "conversas" && (
        <ConversasTab motivos={periodData.motivos} canais={periodData.canais} />
      )}
    </section>
  );
}

