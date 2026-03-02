import { useState } from "react";
import { KnowledgeToolbar } from "./KnowledgeToolbar";
import type { KnowledgeViewMode } from "./KnowledgeToolbar";
import { KnowledgeTable } from "./KnowledgeTable";
import { KnowledgeCard } from "./KnowledgeCard";
import type { KnowledgeSource } from "../knowledge-data";
import { Icons } from "../../../components/icons";

interface KnowledgeContentProps {
  sources: KnowledgeSource[];
  onSourcesChange: (sources: KnowledgeSource[]) => void;
  onEdit: (source: KnowledgeSource) => void;
  onAddKnowledge?: () => void;
}

export function KnowledgeContent({
  sources,
  onSourcesChange,
  onEdit,
  onAddKnowledge,
}: KnowledgeContentProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<KnowledgeViewMode>("list");

  const filtered =
    search.trim() === ""
      ? sources
      : sources.filter(
          (s) =>
            s.nome.toLowerCase().includes(search.toLowerCase()) ||
            s.preview.toLowerCase().includes(search.toLowerCase()) ||
            s.atualizadoPor.toLowerCase().includes(search.toLowerCase())
        );

  const handleDelete = (id: string) => {
    onSourcesChange(sources.filter((s) => s.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    onSourcesChange(
      sources.map((s) =>
        s.id === id ? { ...s, disponivel: !s.disponivel } : s
      )
    );
  };

  const handleAddDocument = () => {
    onAddKnowledge?.();
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
          Conhecimento
        </h2>
        <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
          Base de conhecimento que alimenta as respostas do seu agente. Adicione
          documentos (PDF, DOCX) ou URLs para treinar o agente.
        </p>
      </div>

      <KnowledgeToolbar
        totalCount={filtered.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSearchChange={setSearch}
        onAddDocument={handleAddDocument}
      />

      {filtered.length > 0 ? (
        viewMode === "list" ? (
          <KnowledgeTable
            sources={filtered}
            onEdit={onEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((source) => (
              <KnowledgeCard
                key={source.id}
                source={source}
                onEdit={onEdit}
                onAction={() => {}}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-(--talqui-radius-xl) border border-dashed border-(--talqui-border-weak) bg-(--talqui-bg-weaker) py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-sm">
            <Icons.BookOpen size={24} className="text-(--talqui-text-medium)" />
          </div>
          <div>
            <p className="text-sm font-semibold text-(--talqui-text-medium)">
              {search.trim() ? "Nenhuma fonte encontrada" : "Nenhuma fonte adicionada"}
            </p>
            <p className="mt-1 text-xs text-(--talqui-text-weak)">
              {search.trim()
                ? "Tente outra busca ou limpe o filtro."
                : "Adicione documentos ou URLs para treinar o agente com seu conhecimento."}
            </p>
          </div>
          {!search.trim() && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleAddDocument}
                className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-sm) bg-(--talqui-text-primary) px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:opacity-90"
              >
                <Icons.Plus size={20} />
                Adicionar conhecimento
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
