import { useState, useRef, useEffect } from "react";
import { Icons } from "../../../components/icons";
import type { Procedure } from "../data";

interface ProceduresTableProps {
  procedures: Procedure[];
  onEdit?: (procedure: Procedure) => void;
  onDelete?: (id: string) => void;
  onDeactivate?: (procedure: Procedure) => void;
}

const COLUMNS = [
  { key: "titulo", label: "Título" },
  { key: "disparador", label: "Disparador" },
  { key: "habilidades", label: "Habilidades" },
  { key: "frequencia", label: "Frequência" },
  { key: "acoes", label: "Ações" },
] as const;

/** Procedimento está "em uso" quando já teve uso (frequência > 0) */
function isInUse(proc: Procedure): boolean {
  return proc.frequency > 0;
}

export function ProceduresTable({
  procedures,
  onEdit,
  onDelete,
  onDeactivate,
}: ProceduresTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  return (
    <div className="min-w-0 overflow-auto rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-(--talqui-border-weak) bg-(--talqui-bg-weaker)">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 font-semibold text-(--talqui-text-medium)"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {procedures.map((proc) => {
            const inUse = isInUse(proc);
            return (
              <tr
                key={proc.id}
                onClick={() => onEdit?.(proc)}
                className="cursor-pointer border-b border-(--talqui-border-weak) transition-colors duration-150 hover:bg-(--talqui-bg-weaker)/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-(--talqui-text-strong)">
                      {proc.title}
                    </span>
                    {proc.titleBadge === "star" && (
                      <span className="text-(--talqui-text-weak)" aria-hidden>★</span>
                    )}
                    {proc.titleBadge === "arrow" && (
                      <Icons.Exchange size={14} className="text-(--talqui-text-weak)" aria-hidden />
                    )}
                  </div>
                </td>
                <td className="max-w-[280px] truncate px-4 py-3 text-(--talqui-text-medium)">
                  {proc.trigger}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Icons.ChatBubble size={16} className="text-(--talqui-text-weak)" />
                    {proc.skillsCount > 1 && (
                      <span className="text-xs font-medium text-(--talqui-text-medium)">
                        +{proc.skillsCount - 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-(--talqui-text-medium)">
                    <Icons.Eye size={16} className="shrink-0 text-(--talqui-text-weak)" />
                    {proc.frequency}
                  </div>
                </td>
                <td className="relative px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div
                    className="relative flex items-center justify-center"
                    ref={openMenuId === proc.id ? menuRef : undefined}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((id) => (id === proc.id ? null : proc.id));
                      }}
                      title="Ações"
                      aria-label="Abrir menu de ações"
                      aria-expanded={openMenuId === proc.id}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-medium) transition-colors duration-200 hover:bg-(--talqui-bg-weaker)"
                    >
                      <Icons.MoreVertical size={20} />
                    </button>
                    {openMenuId === proc.id && (
                      <div
                        className="absolute right-0 top-full z-10 mt-1 min-w-[180px] rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white py-1 shadow-lg"
                        role="menu"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            onEdit?.(proc);
                            setOpenMenuId(null);
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
                        >
                          <Icons.Edit size={16} />
                          Editar
                        </button>
                        {inUse ? (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              onDeactivate?.(proc);
                              setOpenMenuId(null);
                            }}
                            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
                          >
                            <Icons.Refresh size={16} />
                            Desativar
                          </button>
                        ) : (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              onDelete?.(proc.id);
                              setOpenMenuId(null);
                            }}
                            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Icons.Delete size={16} />
                            Excluir
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
