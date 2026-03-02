import { useState, useMemo, useRef, useEffect } from "react";
import { Icons } from "../../../components/icons";
import { Button } from "../../../components/ui/Button";
import { KnowledgeSelect } from "../../../components/ui/KnowledgeSelect";
import { MarkdownEditor } from "../../../components/ui/MarkdownEditor";
import {
  stripLeadingHeading,
  extractMentionIds,
} from "../../../lib/markdown-utils";
import type { Procedure } from "../data";
import type { ProcedureVersao } from "../data";
import {
  PROCEDURE_TIPOS,
  PROCEDURE_ESTADOS,
  PROCEDURE_CATEGORIAS,
  PROCEDURE_HABILIDADES,
  type ProcedureTipo,
  type ProcedureEstado,
  type ProcedureCategoria,
  type ProcedureHabilidade,
} from "../data";
import {
  KNOWLEDGE_FORMATO_LABELS,
  type KnowledgeSource,
} from "../knowledge-data";

interface ProcedureEditorPageProps {
  procedure: Procedure;
  knowledgeSources: KnowledgeSource[];
  onBack: () => void;
  onSave: (id: string, data: ProcedureSaveData) => void;
  onDelete: (id: string) => void;
  onPublishVersion: (id: string, v: ProcedureVersao) => void;
}

export interface ProcedureSaveData {
  title: string;
  content: string;
  tipo: ProcedureTipo;
  estado: ProcedureEstado;
  categoria: ProcedureCategoria;
  habilidades: ProcedureHabilidade[];
  knowledgeIds: string[];
  /** Quando true, publica e incrementa versão */
  publicar: boolean;
}

const headerInputClasses =
  "min-h-[40px] flex-1 min-w-0 rounded-(--talqui-radius-sm) border border-transparent bg-transparent px-2 py-2 text-base font-bold leading-6 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:border-(--talqui-border-strong) focus:bg-(--talqui-bg-base) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong) transition-colors duration-200";

const labelClasses = "text-sm font-semibold leading-5 text-(--talqui-text-strong)";
const inputBaseClasses =
  "min-h-[36px] w-full rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-3 py-2 text-sm leading-5 text-(--talqui-text-strong) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong) transition-colors duration-200";

export function ProcedureEditorPage({
  procedure,
  knowledgeSources,
  onBack,
  onSave,
  onDelete,
  onPublishVersion,
}: ProcedureEditorPageProps) {
  const [title, setTitle] = useState(procedure.title);
  const [content, setContent] = useState(stripLeadingHeading(procedure.content));
  const [tipo, setTipo] = useState<ProcedureTipo>(procedure.tipo);
  const [estado, setEstado] = useState<ProcedureEstado>(procedure.estado);
  const [categoria, setCategoria] = useState<ProcedureCategoria>(procedure.categoria);
  const [knowledgeIds, setKnowledgeIds] = useState<string[]>(
    [...procedure.knowledgeIds]
  );
  const [expandedHabilidade, setExpandedHabilidade] =
    useState<ProcedureHabilidade | null>(null);
  /** Versão do histórico sendo visualizada (read-only). Null = editando rascunho atual */
  const [viewingVersion, setViewingVersion] = useState<ProcedureVersao | null>(
    null
  );
  const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);
  const versionDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!versionDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (versionDropdownRef.current && !versionDropdownRef.current.contains(e.target as Node)) {
        setVersionDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [versionDropdownOpen]);

  const validHabilidadeIds = new Set(
    PROCEDURE_HABILIDADES.map((h) => h.value)
  );

  const mentionItems = useMemo(
    () =>
      PROCEDURE_HABILIDADES.map((h) => ({
        id: h.value,
        label: h.label,
      })),
    []
  );

  const hasChanges =
    title !== procedure.title ||
    content !== stripLeadingHeading(procedure.content) ||
    tipo !== procedure.tipo ||
    estado !== procedure.estado ||
    categoria !== procedure.categoria ||
    JSON.stringify(knowledgeIds.sort()) !==
      JSON.stringify([...procedure.knowledgeIds].sort());

  const buildSaveData = (): ProcedureSaveData => {
    const extracted = extractMentionIds(content).filter((id) =>
      validHabilidadeIds.has(id as ProcedureHabilidade)
    ) as ProcedureHabilidade[];
    const habilidades =
      extracted.length > 0
        ? extracted
        : (procedure.habilidades.filter((h) => validHabilidadeIds.has(h)) as ProcedureHabilidade[]);

    return {
      title,
      content,
      tipo,
      estado,
      categoria,
      habilidades,
      knowledgeIds,
      publicar: false,
    };
  };

  const handleSaveDraft = () => {
    onSave(procedure.id, { ...buildSaveData(), publicar: false });
    onBack();
  };

  const handlePublish = () => {
    onSave(procedure.id, { ...buildSaveData(), publicar: true });
    onBack();
  };

  const handleDelete = () => {
    if (window.confirm("Excluir este procedimento? Esta ação não pode ser desfeita.")) {
      onDelete(procedure.id);
      onBack();
    }
  };

  const displayContent = viewingVersion
    ? stripLeadingHeading(viewingVersion.content)
    : content;
  const isViewingHistory = viewingVersion !== null;

  const versoesOrdenadas = [...(procedure.versoes ?? [])].sort(
    (a, b) => b.versao - a.versao
  );

  const formatVersionDate = (iso: string | undefined) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-4 border-b border-(--talqui-border-weak) bg-(--talqui-bg-base) px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-medium) transition-colors duration-200 hover:bg-(--talqui-bg-weaker) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2"
          aria-label="Voltar"
        >
          <Icons.ArrowLeft size={20} />
        </button>
        <input
          type="text"
          value={isViewingHistory ? viewingVersion!.title : title}
          onChange={(e) => !isViewingHistory && setTitle(e.target.value)}
          placeholder="Nome do procedimento"
          readOnly={isViewingHistory}
          className={headerInputClasses}
        />
        <div className="relative shrink-0" ref={versionDropdownRef}>
          <button
            type="button"
            onClick={() => setVersionDropdownOpen((open) => !open)}
            className="flex cursor-pointer items-center gap-1.5 rounded-(--talqui-radius-sm) py-1.5 pl-2.5 pr-2 text-left text-sm text-(--talqui-text-weak) transition-colors hover:bg-(--talqui-bg-weaker) hover:text-(--talqui-text-medium) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2"
            aria-expanded={versionDropdownOpen}
            aria-haspopup="listbox"
            aria-label="Selecionar versão"
          >
            <span>
              {isViewingHistory
                ? `Versão ${viewingVersion!.versao}`
                : procedure.publicado
                  ? `Versão ${procedure.versao} · Em uso`
                  : `Versão ${procedure.versao} · Rascunho`}
            </span>
            <Icons.ChevronDown
              size={16}
              className={`shrink-0 transition-transform duration-200 ${versionDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {versionDropdownOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 min-w-[220px] rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white py-1 shadow-lg"
              role="listbox"
            >
              <button
                type="button"
                role="option"
                aria-selected={!isViewingHistory}
                onClick={() => {
                  setViewingVersion(null);
                  setVersionDropdownOpen(false);
                }}
                className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-(--talqui-bg-weaker) ${
                  !isViewingHistory
                    ? "bg-(--talqui-primary-a10) font-medium text-(--talqui-text-strong)"
                    : "text-(--talqui-text-medium)"
                }`}
              >
                <span>Rascunho atual</span>
                <span className="text-xs text-(--talqui-text-weak)">
                  {procedure.publicado
                    ? `Versão ${procedure.versao} · Em uso`
                    : `Versão ${procedure.versao} · Rascunho`}
                </span>
              </button>
              {versoesOrdenadas.map((v) => {
                const isSelected = viewingVersion?.versao === v.versao;
                return (
                  <button
                    key={v.versao}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setViewingVersion(v);
                      setVersionDropdownOpen(false);
                    }}
                    className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-(--talqui-bg-weaker) ${
                      isSelected
                        ? "bg-(--talqui-primary-a10) font-medium text-(--talqui-text-strong)"
                        : "text-(--talqui-text-medium)"
                    }`}
                  >
                    <span>Versão {v.versao}</span>
                    {v.createdAt && (
                      <span className="text-xs text-(--talqui-text-weak)">
                        {formatVersionDate(v.createdAt)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isViewingHistory ? (
            <>
              <Button
                size="medium"
                variant="secondary"
                onClick={() => setViewingVersion(null)}
              >
                Voltar ao rascunho
              </Button>
              <Button
                size="medium"
                variant="primary"
                onClick={() => {
                  if (viewingVersion) {
                    onPublishVersion(procedure.id, viewingVersion);
                    setTitle(viewingVersion.title);
                    setContent(stripLeadingHeading(viewingVersion.content));
                    setTipo(viewingVersion.tipo);
                    setEstado(viewingVersion.estado);
                    setCategoria(viewingVersion.categoria);
                    setKnowledgeIds([...viewingVersion.knowledgeIds]);
                    setViewingVersion(null);
                  }
                }}
              >
                Publicar esta versão
              </Button>
            </>
          ) : (
            <>
              <Button
                size="medium"
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={!hasChanges}
              >
                Salvar rascunho
              </Button>
              <Button
                size="medium"
                variant="primary"
                onClick={handlePublish}
                disabled={!hasChanges}
              >
                Publicar
              </Button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-(--talqui-radius-sm) text-(--talqui-text-medium) transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Excluir procedimento"
              >
                <Icons.Delete size={20} />
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto p-6">
          <div className="mx-auto flex w-full max-w-none flex-col gap-6">
            <section className="flex min-h-0 flex-1 flex-col gap-2">
              <label className={labelClasses}>Conteúdo</label>
              {isViewingHistory && (
                <p className="text-xs text-(--talqui-text-weak)">
                  Visualização somente leitura. Use &quot;Voltar ao rascunho&quot; para editar ou &quot;Publicar esta versão&quot; para colocá-la em uso.
                </p>
              )}
              <p className="text-xs text-(--talqui-text-weak)">
                Digite <kbd className="rounded bg-(--talqui-bg-weaker) px-1 py-0.5">@</kbd> para inserir uma ação
              </p>
              <MarkdownEditor
                value={displayContent}
                onChange={setContent}
                minHeight="min-h-[calc(100vh-260px)]"
                mentionItems={mentionItems}
                readOnly={isViewingHistory}
              />
            </section>
          </div>
        </main>

        <aside className="flex w-[300px] shrink-0 flex-col gap-6 overflow-auto border-l border-(--talqui-border-weak) bg-(--talqui-bg-weaker) p-6">
          <section className="flex flex-col gap-2">
            <label className={labelClasses}>Tipo</label>
            <div className="flex flex-col gap-2">
              {PROCEDURE_TIPOS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name="tipo"
                    checked={tipo === opt.value}
                    onChange={() => setTipo(opt.value)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-(--talqui-text-strong)">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <label className={labelClasses}>Estado</label>
            <div className="flex flex-col gap-2">
              {PROCEDURE_ESTADOS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name="estado"
                    checked={estado === opt.value}
                    onChange={() => setEstado(opt.value)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-(--talqui-text-strong)">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <label className={labelClasses}>Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as ProcedureCategoria)}
              className={inputBaseClasses}
            >
              {PROCEDURE_CATEGORIAS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </section>

          <section className="flex flex-col gap-2">
            <label className={labelClasses}>Ações disponíveis</label>
            <p className="text-xs text-(--talqui-text-weak)">
              Use <kbd className="rounded bg-(--talqui-bg-weaker) px-1 py-0.5">@</kbd> no editor para mencionar uma ação
            </p>
            <div className="flex flex-col gap-1.5">
              {PROCEDURE_HABILIDADES.map((opt) => {
                const isExpanded = expandedHabilidade === opt.value;
                return (
                  <div
                    key={opt.value}
                    className="overflow-hidden rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white transition-colors duration-200"
                  >
                    <div
                      className="flex cursor-pointer items-start gap-2.5 px-2.5 py-2"
                      onClick={() =>
                        setExpandedHabilidade(isExpanded ? null : opt.value)
                      }
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate text-xs font-medium text-(--talqui-text-weak)">
                          @{opt.value}
                        </span>
                        <span className="truncate text-sm font-medium leading-snug text-(--talqui-text-strong)">
                          {opt.label}
                        </span>
                      </div>
                      <span
                        className={`mt-1 shrink-0 text-(--talqui-text-medium) transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        <Icons.ChevronDown size={14} />
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-(--talqui-border-weak) px-2.5 py-2">
                        <p className="text-xs leading-relaxed text-(--talqui-text-medium)">
                          {opt.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <label className={labelClasses}>Histórico de versões</label>
            <p className="text-xs text-(--talqui-text-weak)">
              Versão em uso, rascunho e publicações anteriores
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setViewingVersion(null)}
                className={`flex w-full flex-col gap-0.5 rounded-(--talqui-radius-lg) border px-2.5 py-2 text-left transition-colors ${
                  !viewingVersion
                    ? "border-(--talqui-text-primary) bg-(--talqui-primary-a10)"
                    : "border-(--talqui-border-weak) bg-white hover:bg-(--talqui-bg-weaker)"
                }`}
              >
                <span className="text-sm font-medium text-(--talqui-text-strong)">
                  {procedure.publicado
                    ? `Versão ${procedure.versao} · Em uso`
                    : "Rascunho atual"}
                </span>
                {procedure.publicado && (
                  <span className="text-xs text-(--talqui-text-weak)">
                    Publicada · conteúdo atual
                  </span>
                )}
              </button>
              {versoesOrdenadas.map((v) => {
                const isSelected =
                  viewingVersion?.versao === v.versao;
                return (
                  <div
                    key={v.versao}
                    className={`overflow-hidden rounded-(--talqui-radius-lg) border bg-white transition-colors ${
                      isSelected
                        ? "border-(--talqui-text-primary) bg-(--talqui-primary-a10)"
                        : "border-(--talqui-border-weak)"
                    }`}
                  >
                    <div className="flex flex-col gap-1.5 px-2.5 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-(--talqui-text-strong)">
                          Versão {v.versao}
                        </span>
                        {v.createdAt && (
                          <span className="text-xs text-(--talqui-text-weak)">
                            {formatVersionDate(v.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingVersion(v)}
                          className="rounded-(--talqui-radius-sm) bg-(--talqui-bg-weaker) px-2 py-1 text-xs font-medium text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-border-weak)"
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onPublishVersion(procedure.id, v);
                            setTitle(v.title);
                            setContent(stripLeadingHeading(v.content));
                            setTipo(v.tipo);
                            setEstado(v.estado);
                            setCategoria(v.categoria);
                            setKnowledgeIds([...v.knowledgeIds]);
                            setViewingVersion(null);
                          }}
                          className="rounded-(--talqui-radius-sm) bg-(--talqui-text-primary) px-2 py-1 text-xs font-medium text-white transition-colors hover:opacity-90"
                        >
                          Publicar esta versão
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {versoesOrdenadas.length === 0 && (
                <p className="px-2 text-xs text-(--talqui-text-weak)">
                  Nenhuma versão anterior. Ao publicar, uma nova versão será salva aqui.
                </p>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <label className={labelClasses}>Conhecimento</label>
            <p className="text-xs text-(--talqui-text-weak)">
              Vincule conhecimentos que ajudam neste procedimento
            </p>
            <div className="flex flex-col gap-1.5">
              <KnowledgeSelect
                sources={knowledgeSources.map((s) => ({
                  id: s.id,
                  nome: s.nome,
                  formato: KNOWLEDGE_FORMATO_LABELS[s.formato],
                }))}
                selectedIds={knowledgeIds}
                onChange={setKnowledgeIds}
                placeholder="Buscar conhecimento..."
                emptyMessage="Nenhum conhecimento adicionado"
                triggerType="add"
              />
              {knowledgeIds.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {knowledgeSources
                    .filter((s) => knowledgeIds.includes(s.id))
                    .map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center gap-2 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white px-2.5 py-2"
                      >
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-(--talqui-text-strong)">
                          {s.nome}
                        </span>
                        <span className="shrink-0 rounded bg-(--talqui-bg-weaker) px-2 py-0.5 text-xs text-(--talqui-text-medium)">
                          {KNOWLEDGE_FORMATO_LABELS[s.formato]}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setKnowledgeIds((prev) =>
                              prev.filter((id) => id !== s.id)
                            )
                          }
                          className="flex shrink-0 cursor-pointer items-center justify-center rounded p-1 text-(--talqui-text-medium) transition-colors hover:bg-(--talqui-bg-weaker) hover:text-(--talqui-text-strong) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary)"
                          aria-label={`Remover ${s.nome}`}
                        >
                          <Icons.Close size={14} />
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
