import { ChartCard } from "../../../components/ui/ChartCard";

function DonutChart({
  data,
  total,
  size = 140,
  strokeWidth = 24,
}: {
  data: { label: string; value: number; color: string }[];
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const segments = data.map((d) => {
    const pct = total > 0 ? d.value / total : 0;
    const dash = circumference * pct;
    const seg = { ...d, dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.dash} ${circumference}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <span className="absolute text-center text-lg font-bold text-(--talqui-text-strong)">
        {total.toLocaleString("pt-BR")}
      </span>
    </div>
  );
}

/**
 * Barras verticais empilhadas (um bar por dia/item). Eixo Y: Assertividade (%).
 */
function StackedBarChart({
  data,
  height = 120,
  targetLine = 50,
}: {
  data: { label: string; segments: { value: number; color: string }[] }[];
  height?: number;
  targetLine?: number;
}) {
  return (
    <div className="relative flex flex-col gap-1">
      <div className="relative flex items-end justify-between gap-0.5" style={{ height }}>
        {targetLine != null && (
          <div
            className="absolute left-0 right-0 border-t border-dashed border-(--talqui-border-strong)"
            style={{ bottom: `${targetLine}%`, pointerEvents: "none" }}
            aria-hidden
          />
        )}
        {data.map((bar, i) => {
          const total = bar.segments.reduce((s, seg) => s + seg.value, 0);
          return (
            <div
              key={i}
              className="flex min-w-0 flex-1 flex-col justify-end rounded-t-[2px] overflow-hidden"
              style={{ minHeight: 8 }}
            >
              {bar.segments.map((seg, j) => {
                const pct = total > 0 ? (seg.value / total) * 100 : 0;
                return (
                  <div
                    key={j}
                    className="w-full transition-colors"
                    style={{
                      height: `${pct}%`,
                      minHeight: pct > 0 ? 2 : 0,
                      backgroundColor: seg.color,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex flex-wrap justify-between gap-1 text-xs text-(--talqui-text-weak)">
        {data.map((bar, i) => (
          <span key={i}>{bar.label}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Barras horizontais (uma por procedimento). Eixo X: Assertividade %.
 */
function HorizontalStackedBarChart({
  data,
  targetLine = 50,
}: {
  data: { label: string; success: number; failure: number }[];
  targetLine?: number;
}) {
  const successColor = "var(--talqui-green-500)";
  const failureColor = "#dc2626";

  return (
    <div className="flex w-full flex-col gap-2">
      {data.map((row, i) => {
        const total = row.success + row.failure;
        const successPct = total > 0 ? (row.success / total) * 100 : 0;
        return (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="truncate text-xs font-medium text-(--talqui-text-strong)">
              {row.label}
            </span>
            <div className="relative flex h-6 w-full overflow-hidden rounded-(--talqui-radius-sm) bg-(--talqui-bg-weaker)">
              <div
                className="h-full transition-all"
                style={{
                  width: `${successPct}%`,
                  backgroundColor: successColor,
                }}
              />
              <div
                className="h-full transition-all"
                style={{
                  width: `${100 - successPct}%`,
                  backgroundColor: failureColor,
                }}
              />
              {targetLine != null && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-(--talqui-text-strong) opacity-50"
                  style={{ left: `${targetLine}%` }}
                  aria-hidden
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SUCCESS_COLOR = "var(--talqui-green-500)";
const FAILURE_COLOR = "#dc2626";
const ABANDON_COLOR = "#9ca3af";

// Dados mock conforme o dashboard de referência
const MOCK_ATENDIMENTOS_AGREGADO = {
  total: 424,
  data: [
    { label: "Falha", value: 0.61 * 424, color: FAILURE_COLOR },
    { label: "Sucesso", value: 0.39 * 424, color: SUCCESS_COLOR },
  ],
};

const MOCK_ATENDIMENTOS_DIARIO = [
  { label: "22/1", segments: [{ value: 45, color: FAILURE_COLOR }, { value: 55, color: SUCCESS_COLOR }] },
  { label: "23/1", segments: [{ value: 60, color: FAILURE_COLOR }, { value: 40, color: SUCCESS_COLOR }] },
  { label: "24/1", segments: [{ value: 52, color: FAILURE_COLOR }, { value: 48, color: SUCCESS_COLOR }] },
  { label: "25/1", segments: [{ value: 70, color: FAILURE_COLOR }, { value: 30, color: SUCCESS_COLOR }] },
  { label: "26/1", segments: [{ value: 38, color: FAILURE_COLOR }, { value: 62, color: SUCCESS_COLOR }] },
  { label: "27/1", segments: [{ value: 55, color: FAILURE_COLOR }, { value: 45, color: SUCCESS_COLOR }] },
  { label: "28/1", segments: [{ value: 48, color: FAILURE_COLOR }, { value: 52, color: SUCCESS_COLOR }] },
];

const MOCK_ATENDIMENTOS_AUTONOMO = {
  total: 424,
  data: [
    { label: "Falha", value: 0.903 * 424, color: FAILURE_COLOR },
    { label: "Sucesso", value: 0.097 * 424, color: SUCCESS_COLOR },
  ],
};

const MOCK_PROCEDIMENTOS_INDIVIDUAL = [
  { label: "Apresentação", success: 72, failure: 28 },
  { label: "Transferência", success: 58, failure: 42 },
  { label: "Planos e Preços", success: 65, failure: 35 },
  { label: "Boletos de 2ª Via", success: 48, failure: 52 },
  { label: "Suporte técnico", success: 41, failure: 59 },
  { label: "Onboarding", success: 80, failure: 20 },
  { label: "Impressão BP", success: 55, failure: 45 },
  { label: "Troca de Plano", success: 38, failure: 62 },
  { label: "Whatsapp", success: 90, failure: 10 },
  { label: "Trial", success: 62, failure: 38 },
];

const MOCK_PROCEDIMENTOS_AGREGADO = {
  total: 618,
  data: [
    { label: "Falha", value: 0.51 * 618, color: FAILURE_COLOR },
    { label: "Sucesso", value: 0.26 * 618, color: SUCCESS_COLOR },
    { label: "Abandono", value: 0.23 * 618, color: ABANDON_COLOR },
  ],
};

const MOCK_PROCEDIMENTOS_DIARIO = [
  { label: "22/1", segments: [{ value: 50, color: ABANDON_COLOR }, { value: 30, color: FAILURE_COLOR }, { value: 20, color: SUCCESS_COLOR }] },
  { label: "23/1", segments: [{ value: 25, color: ABANDON_COLOR }, { value: 45, color: FAILURE_COLOR }, { value: 30, color: SUCCESS_COLOR }] },
  { label: "24/1", segments: [{ value: 20, color: ABANDON_COLOR }, { value: 50, color: FAILURE_COLOR }, { value: 30, color: SUCCESS_COLOR }] },
  { label: "25/1", segments: [{ value: 28, color: ABANDON_COLOR }, { value: 42, color: FAILURE_COLOR }, { value: 30, color: SUCCESS_COLOR }] },
  { label: "26/1", segments: [{ value: 22, color: ABANDON_COLOR }, { value: 48, color: FAILURE_COLOR }, { value: 30, color: SUCCESS_COLOR }] },
  { label: "27/1", segments: [{ value: 18, color: ABANDON_COLOR }, { value: 52, color: FAILURE_COLOR }, { value: 30, color: SUCCESS_COLOR }] },
  { label: "28/1", segments: [{ value: 24, color: ABANDON_COLOR }, { value: 46, color: FAILURE_COLOR }, { value: 30, color: SUCCESS_COLOR }] },
];

const MOCK_TRANSFERENCIAS_DISTRIBUICAO = {
  total: 344,
  data: [
    { label: "Transferência Autônoma", value: 0.55 * 344, color: SUCCESS_COLOR },
    { label: "Transferência Manual", value: 0.45 * 344, color: FAILURE_COLOR },
  ],
};

const MOCK_TRANSFERENCIAS_AUTONOMAS_RESULTADO = {
  total: 188,
  data: [
    { label: "Atendida por Operador", value: 0.968 * 188, color: SUCCESS_COLOR },
    { label: "Não Atendida por Operador", value: 0.032 * 188, color: FAILURE_COLOR },
  ],
};

export function PerformanceContent() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
          Performance
        </h2>
        <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
          Métricas e análises do desempenho do seu agente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChartCard
          title="Atendimentos: Resultado Agregado"
          legend={MOCK_ATENDIMENTOS_AGREGADO.data.map((d) => ({ label: d.label, color: d.color }))}
        >
          <DonutChart
            data={MOCK_ATENDIMENTOS_AGREGADO.data}
            total={MOCK_ATENDIMENTOS_AGREGADO.total}
          />
        </ChartCard>

        <ChartCard
          title="Atendimentos: Resultado Diário"
          legend={[
            { label: "Falha", color: FAILURE_COLOR },
            { label: "Sucesso", color: SUCCESS_COLOR },
          ]}
        >
          <div className="w-full px-2">
            <StackedBarChart data={MOCK_ATENDIMENTOS_DIARIO} targetLine={50} />
          </div>
        </ChartCard>

        <ChartCard
          title="Atendimentos: Resultado Autônomo"
          legend={MOCK_ATENDIMENTOS_AUTONOMO.data.map((d) => ({ label: d.label, color: d.color }))}
        >
          <DonutChart
            data={MOCK_ATENDIMENTOS_AUTONOMO.data}
            total={MOCK_ATENDIMENTOS_AUTONOMO.total}
          />
        </ChartCard>

        <ChartCard
          title="Atendimentos: Resultado Autônomo Diário"
          legend={[
            { label: "Falha", color: FAILURE_COLOR },
            { label: "Sucesso", color: SUCCESS_COLOR },
          ]}
        >
          <div className="w-full px-2">
            <StackedBarChart data={MOCK_ATENDIMENTOS_DIARIO} targetLine={50} />
          </div>
        </ChartCard>

        <ChartCard
          title="Procedimentos: Resultado Individual"
          legend={[
            { label: "Sucesso", color: SUCCESS_COLOR },
            { label: "Falha", color: FAILURE_COLOR },
          ]}
        >
          <HorizontalStackedBarChart data={MOCK_PROCEDIMENTOS_INDIVIDUAL} targetLine={50} />
        </ChartCard>

        <ChartCard
          title="Procedimentos: Resultado Agregado"
          legend={MOCK_PROCEDIMENTOS_AGREGADO.data.map((d) => ({ label: d.label, color: d.color }))}
        >
          <DonutChart
            data={MOCK_PROCEDIMENTOS_AGREGADO.data}
            total={MOCK_PROCEDIMENTOS_AGREGADO.total}
          />
        </ChartCard>

        <ChartCard
          title="Procedimentos: Resultado Diário"
          legend={[
            { label: "Abandono", color: ABANDON_COLOR },
            { label: "Falha", color: FAILURE_COLOR },
            { label: "Sucesso", color: SUCCESS_COLOR },
          ]}
        >
          <div className="w-full px-2">
            <StackedBarChart data={MOCK_PROCEDIMENTOS_DIARIO} targetLine={50} />
          </div>
        </ChartCard>

        <ChartCard
          title="Transferências: Perfil de Distribuição"
          legend={MOCK_TRANSFERENCIAS_DISTRIBUICAO.data.map((d) => ({ label: d.label, color: d.color }))}
        >
          <DonutChart
            data={MOCK_TRANSFERENCIAS_DISTRIBUICAO.data}
            total={MOCK_TRANSFERENCIAS_DISTRIBUICAO.total}
          />
        </ChartCard>

        <ChartCard
          title="Transferências Autônomas: Resultado"
          legend={MOCK_TRANSFERENCIAS_AUTONOMAS_RESULTADO.data.map((d) => ({ label: d.label, color: d.color }))}
        >
          <DonutChart
            data={MOCK_TRANSFERENCIAS_AUTONOMAS_RESULTADO.data}
            total={MOCK_TRANSFERENCIAS_AUTONOMAS_RESULTADO.total}
          />
        </ChartCard>
      </div>
    </section>
  );
}
