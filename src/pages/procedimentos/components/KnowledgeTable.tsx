import { useState, useRef, useEffect } from "react";
import { Icons } from "../../../components/icons";
import type { KnowledgeSource } from "../knowledge-data";

interface KnowledgeTableProps {
  sources: KnowledgeSource[];
  onEdit?: (source: KnowledgeSource) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  if (diffDays === 1) return "ontem";
  if (diffDays <= 7) return diffDays === 7 ? "semana passada" : `há ${diffDays} dias`;
  return formatDate(iso);
}

export function KnowledgeTable({
  sources,
  onEdit,
  onDelete,
  onToggleStatus,
}: KnowledgeTableProps) {
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
    <div className="min-w-0 overflow-hidden rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-(--talqui-border-weak) bg-(--talqui-bg-weaker)">
            <th className="w-8 shrink-0 truncate px-1.5 py-3 text-center font-semibold text-(--talqui-text-medium)">
              Nº
            </th>
            <th className="w-[22%] min-w-0 truncate px-3 py-3 font-semibold text-(--talqui-text-medium)">
              Nome
            </th>
            <th className="w-[20%] min-w-0 truncate px-3 py-3 font-semibold text-(--talqui-text-medium)">
              Preview
            </th>
            <th className="w-[14%] min-w-0 truncate px-2 py-3 font-semibold text-(--talqui-text-medium)">
              Última atualização
            </th>
            <th className="w-[13%] min-w-0 truncate px-2 py-3 font-semibold text-(--talqui-text-medium)">
              Atualizado por
            </th>
            <th className="w-[12%] min-w-0 truncate px-3 py-3 font-semibold text-(--talqui-text-medium)">
              Status
            </th>
            <th className="w-8 shrink-0 truncate px-1 py-3 text-center font-semibold text-(--talqui-text-medium)">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr
              key={source.id}
              onClick={() => onEdit?.(source)}
              className="cursor-pointer border-b border-(--talqui-border-weak) transition-colors duration-150 hover:bg-(--talqui-bg-weaker)/50"
            >
              <td className="w-8 shrink-0 px-1.5 py-3 text-center font-medium text-(--talqui-text-medium)">
                {source.numero}
              </td>
              <td className="min-w-0 px-3 py-3">
                <span className="block truncate font-medium text-(--talqui-text-strong)" title={source.nome}>
                  {source.nome}
                </span>
              </td>
              <td className="min-w-0 px-3 py-3">
                <p className="truncate text-sm text-(--talqui-text-medium)" title={source.preview}>
                  {source.preview}
                </p>
              </td>
              <td className="min-w-0 whitespace-nowrap px-2 py-3 text-(--talqui-text-medium)">
                {formatRelativeDate(source.ultimaAtualizacao)}
              </td>
              <td className="min-w-0 px-2 py-3">
                <span className="block truncate text-(--talqui-text-medium)" title={source.atualizadoPor}>
                  {source.atualizadoPor}
                </span>
              </td>
              <td className="px-3 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    source.disponivel
                      ? "bg-(--talqui-green-a10) text-(--talqui-text-success)"
                      : "bg-(--talqui-bg-weaker) text-(--talqui-text-medium)"
                  }`}
                >
                  {source.disponivel ? "Disponível" : "Indisponível"}
                </span>
              </td>
              <td className="relative w-8 shrink-0 px-1 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="relative flex items-center justify-center" ref={openMenuId === source.id ? menuRef : undefined}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId((id) => (id === source.id ? null : source.id));
                    }}
                    title="Ações"
                    aria-label="Abrir menu de ações"
                    aria-expanded={openMenuId === source.id}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-medium) transition-colors duration-200 hover:bg-(--talqui-bg-weaker)"
                  >
                    <Icons.MoreVertical size={20} />
                  </button>
                  {openMenuId === source.id && (
                    <div
                      className="absolute right-0 top-full z-10 mt-1 min-w-[180px] rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white py-1 shadow-lg"
                      role="menu"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onEdit?.(source);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
                      >
                        <Icons.Edit size={16} />
                        Editar
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onToggleStatus?.(source.id);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
                      >
                        <Icons.Refresh size={16} />
                        Alterar status
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onDelete?.(source.id);
                          setOpenMenuId(null);
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Icons.Delete size={16} />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
