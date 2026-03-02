import { Sidebar } from "../../components/layout/Sidebar";
import { PageHeader } from "../../components/layout/PageHeader";
import type { SidebarNavId } from "../../components/layout/Sidebar";
import {
  EstatisticasContent,
  useEstatisticasPeriod,
  type DateRange,
} from "./EstatisticasContent";

interface EstatisticasPageProps {
  activeNav?: SidebarNavId;
  onNavTo?: (id: SidebarNavId) => void;
  /** Intervalo de datas (modo controlado). */
  dateRange?: DateRange;
  /** Callback ao alterar o intervalo. Permite controle externo. */
  onDateRangeChange?: (range: DateRange) => void;
}

export function EstatisticasPage({
  activeNav = "relatorios",
  onNavTo,
  dateRange: controlledRange,
  onDateRangeChange,
}: EstatisticasPageProps) {
  const { dateRange: internalRange, setDateRange: setInternalRange } =
    useEstatisticasPeriod(controlledRange);
  const isControlled = controlledRange != null && onDateRangeChange != null;
  const dateRange = isControlled ? controlledRange : internalRange;
  const setDateRange = isControlled ? onDateRangeChange : setInternalRange;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--talqui-bg-weaker) p-1">
      <Sidebar activeNav={activeNav} onNavClick={onNavTo} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-(--talqui-radius-xl)">
        <PageHeader title="Estatísticas" />
        <div className="flex min-h-0 flex-1 w-full flex-col overflow-hidden bg-white">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-8 overflow-auto px-10 py-8">
            <div className="mx-auto w-full max-w-[var(--talqui-main-max-w)] flex flex-col gap-8">
              <EstatisticasContent dateRange={dateRange} onDateRangeChange={setDateRange} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

