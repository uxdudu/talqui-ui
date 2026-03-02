import { Icons } from "../../../components/icons";
import type { KnowledgeSource } from "../knowledge-data";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface KnowledgeCardProps {
  source: KnowledgeSource;
  onEdit?: (source: KnowledgeSource) => void;
  onAction?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function KnowledgeCard({
  source,
  onEdit,
  onAction,
  onDelete,
}: KnowledgeCardProps) {
  return (
    <article
      onClick={() => onEdit?.(source)}
      className="flex cursor-pointer flex-col overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-weak) bg-white transition-shadow duration-200 hover:shadow-md"
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--talqui-radius-lg) bg-(--talqui-bg-weaker) text-sm font-bold text-(--talqui-text-medium)">
            {source.numero}
          </span>
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              source.disponivel
                ? "bg-(--talqui-green-a10) text-(--talqui-text-success)"
                : "bg-(--talqui-bg-weaker) text-(--talqui-text-medium)"
            }`}
          >
            {source.disponivel ? "Disponível" : "Indisponível"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-6 text-(--talqui-text-strong)">
            {source.nome}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-(--talqui-text-medium)">
            {source.preview}
          </p>
          <div className="mt-3 flex flex-col gap-0.5 text-xs text-(--talqui-text-weak)">
            <span>Atualizado em {formatDate(source.ultimaAtualizacao)}</span>
            <span>por {source.atualizadoPor}</span>
          </div>
        </div>
      </div>
      <div
        className="flex items-center justify-end gap-1 border-t border-(--talqui-border-weak) p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onAction?.(source.id)}
          title="Ações"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-medium) transition-colors duration-200 hover:bg-(--talqui-bg-weaker)"
        >
          <Icons.MoreVertical size={20} />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(source.id)}
          title="Remover"
          aria-label="Remover fonte"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-weak) transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <Icons.Delete size={20} />
        </button>
      </div>
    </article>
  );
}
