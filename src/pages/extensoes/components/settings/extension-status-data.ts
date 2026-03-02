/**
 * Dados mock de status e incidentes por extensão.
 * Em produção viriam de API/backend.
 */

export type BarStatus = "ok" | "degraded" | "outage";

/** Tooltip por barra (um dia): data formatada e incidentes nesse dia. */
export interface BarDayTooltip {
  dateLabel: string; // ex: "Tue, 2 Mar 2026"
  incidents?: { title: string }[];
}

export interface StatusComponent {
  id: string;
  name: string;
  componentCount?: number;
  uptime: number;
  /** Um valor por dia (ou período) no intervalo exibido. */
  bars: BarStatus[];
  /** Opcional: tooltip por barra (mesmo length que bars). */
  barTooltips?: BarDayTooltip[];
}

export interface StatusIncident {
  id: string;
  date: string; // ISO date
  dayLabel: string; // "02 (segunda-feira)"
  title: string;
  resolution: string;
  time: string; // "14:14"
}

export interface ExtensionStatusData {
  overall: "operational" | "degraded" | "outage";
  components: StatusComponent[];
  incidentsByMonth: Record<string, StatusIncident[]>; // "2026-03" -> incidents
  dateRangeLabel: string;
}

const BARS_90 = 90;
const STATUS_END_DATE = new Date("2026-03-02");

function dateToKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDayLabel(d: Date): string {
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const w = weekdays[d.getDay()];
  return `${w}, ${String(day).padStart(2, "0")} ${month}/${year}`;
}

/** Monta um array de tooltips por barra (uma por dia) e preenche incidentes nos dias corretos. */
function buildBarTooltips(
  incidentsByMonth: Record<string, StatusIncident[]>
): BarDayTooltip[] {
  const tooltips: BarDayTooltip[] = [];
  const incidentsByDay: Record<string, { title: string }[]> = {};
  for (const monthId of Object.keys(incidentsByMonth)) {
    for (const inc of incidentsByMonth[monthId] ?? []) {
      const key = inc.date.slice(0, 10);
      if (!incidentsByDay[key]) incidentsByDay[key] = [];
      incidentsByDay[key].push({ title: inc.title });
    }
  }
  for (let i = 0; i < BARS_90; i++) {
    const d = new Date(STATUS_END_DATE);
    d.setDate(d.getDate() - (BARS_90 - 1 - i));
    const key = dateToKey(d);
    const incidents = incidentsByDay[key];
    tooltips.push({
      dateLabel: formatDayLabel(d),
      incidents: incidents?.length ? incidents : undefined,
    });
  }
  return tooltips;
}

function generateBars(okRatio: number, degradedRatio: number): BarStatus[] {
  const out: BarStatus[] = [];
  const nOk = Math.round(BARS_90 * okRatio);
  const nDegraded = Math.round(BARS_90 * degradedRatio);
  for (let i = 0; i < nOk; i++) out.push("ok");
  for (let i = 0; i < nDegraded; i++) out.push("degraded");
  while (out.length < BARS_90) out.push("outage");
  return out.slice(0, BARS_90);
}

/** Gera dados de status padrão para qualquer extensão. */
export function getExtensionStatusData(extensionId: string): ExtensionStatusData {
  const overall = getExtensionOverallStatus(extensionId);
  const hasIncidents = extensionId === "ifood" || extensionId === "mercadolivre";
  const incidentsByMonth = hasIncidents
    ? {
        "2026-03": [
          {
            id: "1",
            date: "2026-03-02",
            dayLabel: "02 (segunda-feira)",
            title: "Erros intermitentes na API de pedidos",
            resolution: "Todos os serviços impactados foram restabelecidos.",
            time: "14:14",
          },
          {
            id: "2",
            date: "2026-03-02",
            dayLabel: "02 (segunda-feira)",
            title: "Latência elevada nas mensagens",
            resolution: "Todos os serviços impactados foram restabelecidos.",
            time: "14:09",
          },
        ],
        "2026-02": [],
        "2026-01": [],
        "2025-12": [],
      }
    : {
        "2026-03": [],
        "2026-02": [],
        "2026-01": [],
        "2025-12": [],
      };

  const barTooltips = buildBarTooltips(incidentsByMonth);
  const components = getComponentsForExtension(extensionId, barTooltips);

  return {
    overall,
    dateRangeLabel: "Dez 2025 - Mar 2026",
    components,
    incidentsByMonth,
  };
}

/** Status geral do serviço da extensão (para exibir no card da lista). */
export function getExtensionOverallStatus(
  extensionId: string
): "operational" | "degraded" | "outage" {
  // Mock: algumas extensões com problema para demonstrar o indicador no card.
  // Em produção viria de API em tempo real.
  if (extensionId === "hotmart") return "outage";
  if (extensionId === "instagram") return "degraded";
  return "operational";
}

function getComponentsForExtension(
  extensionId: string,
  barTooltips: BarDayTooltip[]
): StatusComponent[] {
  const incidentBarIndex = BARS_90 - 1; // último dia = 2026-03-02 no mock
  const hasIncidents = extensionId === "ifood" || extensionId === "mercadolivre";

  const setIncidentBar = (bars: BarStatus[]): BarStatus[] => {
    if (!hasIncidents || bars[incidentBarIndex] === "ok") return bars;
    const next = [...bars];
    next[incidentBarIndex] = "degraded";
    return next;
  };

  if (extensionId === "ifood") {
    return [
      {
        id: "pedidos",
        name: "API de pedidos",
        uptime: 99.72,
        bars: setIncidentBar(generateBars(0.997, 0.002)),
        barTooltips,
      },
      {
        id: "mensagens",
        name: "API de mensagens",
        uptime: 99.85,
        bars: setIncidentBar(generateBars(0.9985, 0.001)),
        barTooltips,
      },
      {
        id: "webhooks",
        name: "Webhooks",
        componentCount: 3,
        uptime: 100,
        bars: generateBars(1, 0),
        barTooltips,
      },
    ];
  }
  return [
    {
      id: "api",
      name: "API principal",
      uptime: 99.99,
      bars: generateBars(0.9999, 0),
      barTooltips,
    },
    {
      id: "webhooks",
      name: "Webhooks",
      uptime: 100,
      bars: generateBars(1, 0),
      barTooltips,
    },
  ];
}

/** Meses para exibir no histórico (ordem decrescente). */
export const HISTORY_MONTHS = [
  { id: "2026-03", label: "Março" },
  { id: "2026-02", label: "Fevereiro" },
  { id: "2026-01", label: "Janeiro" },
  { id: "2025-12", label: "Dezembro" },
];
