import { useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { PageHeader } from "../../components/layout/PageHeader";
import { ContentSubSidebar } from "../../components/layout/ContentSubSidebar";
import type { SidebarNavId } from "../../components/layout/Sidebar";
import type { ContentSubNavId } from "../../components/layout/ContentSubSidebar";
import {
  AgenteVirtualContent,
  KnowledgeContent,
  KnowledgeEditorPage,
  ProcedureEditorPage,
  ProceduresToolbar,
  ProceduresTable,
  PerformanceContent,
} from "./components";
import { KNOWLEDGE_SOURCES, EMPTY_KNOWLEDGE_SOURCE } from "./knowledge-data";
import type { KnowledgeSource } from "./knowledge-data";
import { PROCEDURES, EMPTY_PROCEDURE } from "./data";
import type { Procedure } from "./data";
import type { ProcedureVersao } from "./data";

interface ProcedimentosPageProps {
  activeNav?: SidebarNavId;
  onNavTo?: (id: SidebarNavId) => void;
}

export function ProcedimentosPage({ activeNav = "procedimentos", onNavTo }: ProcedimentosPageProps) {
  const [search, setSearch] = useState("");
  const [procedures, setProcedures] = useState<Procedure[]>(PROCEDURES);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(
    KNOWLEDGE_SOURCES
  );
  const [editingKnowledge, setEditingKnowledge] =
    useState<KnowledgeSource | null>(null);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(
    null
  );
  const [contentSubNav, setContentSubNav] = useState<ContentSubNavId>("agente-virtual");

  const filtered =
    search.trim() === ""
      ? procedures
      : procedures.filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.trigger.toLowerCase().includes(search.toLowerCase())
        );

  const showKnowledgeEditor =
    contentSubNav === "conhecimento" && editingKnowledge;
  const showProcedureEditor =
    contentSubNav === "procedimentos" && editingProcedure;

  const handleProcedureSave = (
    id: string,
    data: {
      title: string;
      content: string;
      tipo: Procedure["tipo"];
      estado: Procedure["estado"];
      categoria: Procedure["categoria"];
      habilidades: Procedure["habilidades"];
      knowledgeIds: string[];
      publicar: boolean;
    }
  ) => {
    if (id === "new") {
      const nextId = String(
        Math.max(0, ...procedures.map((p) => parseInt(p.id, 10) || 0)) + 1
      );
      const newProcedure: Procedure = {
        id: nextId,
        title: data.title,
        trigger: "",
        content: data.content,
        tipo: data.tipo,
        estado: data.estado,
        categoria: data.categoria,
        habilidades: data.habilidades,
        knowledgeIds: data.knowledgeIds,
        skillsCount: data.habilidades.length,
        frequency: 0,
        versao: data.publicar ? 1 : 1,
        publicado: data.publicar,
        versoes: data.publicar
          ? [
              {
                versao: 1,
                title: data.title,
                content: data.content,
                tipo: data.tipo,
                estado: data.estado,
                categoria: data.categoria,
                habilidades: data.habilidades,
                knowledgeIds: data.knowledgeIds,
                createdAt: new Date().toISOString(),
              } satisfies ProcedureVersao,
            ]
          : [],
      };
      setProcedures((prev) => [...prev, newProcedure]);
      setEditingProcedure(null);
      return;
    }
    setProcedures((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextVersao = data.publicar ? p.versao + 1 : p.versao;
        const newVersoes =
          data.publicar
            ? [
                ...p.versoes,
                {
                  versao: nextVersao,
                  title: data.title,
                  content: data.content,
                  tipo: data.tipo,
                  estado: data.estado,
                  categoria: data.categoria,
                  habilidades: data.habilidades,
                  knowledgeIds: data.knowledgeIds,
                  createdAt: new Date().toISOString(),
                } satisfies ProcedureVersao,
              ]
            : p.versoes;
        return {
          ...p,
          title: data.title,
          content: data.content,
          tipo: data.tipo,
          estado: data.estado,
          categoria: data.categoria,
          habilidades: data.habilidades,
          knowledgeIds: data.knowledgeIds,
          skillsCount: data.habilidades.length,
          versao: nextVersao,
          publicado: data.publicar,
          versoes: newVersoes,
        };
      })
    );
    setEditingProcedure(null);
  };

  const handlePublishVersion = (id: string, v: ProcedureVersao) => {
    setProcedures((prev) => {
      const next = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              title: v.title,
              content: v.content,
              tipo: v.tipo,
              estado: v.estado,
              categoria: v.categoria,
              habilidades: v.habilidades,
              knowledgeIds: v.knowledgeIds,
              skillsCount: v.habilidades.length,
              publicado: true,
            }
          : p
      );
      const updated = next.find((x) => x.id === id) ?? null;
      if (editingProcedure?.id === id && updated)
        setEditingProcedure(updated);
      return next;
    });
  };

  const handleProcedureDelete = (id: string) => {
    setProcedures((prev) => prev.filter((p) => p.id !== id));
    setEditingProcedure(null);
  };

  const handleProcedureDeactivate = (procedure: Procedure) => {
    setProcedures((prev) =>
      prev.map((p) =>
        p.id === procedure.id ? { ...p, publicado: false } : p
      )
    );
    if (editingProcedure?.id === procedure.id) {
      setEditingProcedure((prev) =>
        prev ? { ...prev, publicado: false } : null
      );
    }
  };

  const handleKnowledgeSave = (
    id: string,
    data: { nome: string; content: string; publicar: boolean }
  ) => {
    const plain = data.content
      .replace(/\n/g, " ")
      .replace(/#+\s/g, "")
      .trim();
    const preview =
      plain.length > 60 ? plain.slice(0, 60).trim() + "..." : plain || "—";
    if (id === "new") {
      const nextNumero = knowledgeSources.length + 1;
      const newId = String(
        Math.max(0, ...knowledgeSources.map((s) => parseInt(s.id, 10) || 0)) + 1
      );
      const newSource: KnowledgeSource = {
        id: newId,
        numero: nextNumero,
        nome: data.nome,
        preview,
        content: data.content,
        ultimaAtualizacao: new Date().toISOString(),
        atualizadoPor: "—",
        disponivel: data.publicar,
        formato: "texto",
      };
      setKnowledgeSources((prev) => [...prev, newSource]);
    } else {
      setKnowledgeSources((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                nome: data.nome,
                content: data.content,
                preview,
                disponivel: data.publicar,
                ultimaAtualizacao: new Date().toISOString(),
              }
            : s
        )
      );
    }
    setEditingKnowledge(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--talqui-bg-weaker) p-1">
      <Sidebar activeNav={activeNav} onNavClick={onNavTo} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-(--talqui-radius-xl)">
        {!showKnowledgeEditor && !showProcedureEditor && (
          <PageHeader title="Talqui AI" />
        )}
        <div className="flex min-h-0 flex-1 w-full flex-col overflow-hidden bg-white">
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {!showKnowledgeEditor && !showProcedureEditor && (
              <ContentSubSidebar
                activeId={contentSubNav}
                onNavigate={setContentSubNav}
              />
            )}
            {showKnowledgeEditor ? (
              <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <KnowledgeEditorPage
                  source={editingKnowledge}
                  onBack={() => setEditingKnowledge(null)}
                  onSave={handleKnowledgeSave}
                />
              </main>
            ) : showProcedureEditor ? (
              <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <ProcedureEditorPage
                  procedure={editingProcedure}
                  knowledgeSources={knowledgeSources}
                  onBack={() => setEditingProcedure(null)}
                  onSave={handleProcedureSave}
                  onDelete={handleProcedureDelete}
                  onPublishVersion={handlePublishVersion}
                />
              </main>
            ) : (
            <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-8 overflow-auto px-10 py-8">
              <div className="mx-auto w-full max-w-[900px] flex flex-col gap-8">
              {contentSubNav === "agente-virtual" ? (
                <AgenteVirtualContent />
              ) : (
                <>
                  {contentSubNav === "procedimentos" && (
                    <section className="flex flex-col gap-4">
                      <div>
                        <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
                          Procedimentos
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
                          Defina procedimentos para guiar seu agente de IA no
                          atendimento aos clientes de forma eficiente.
                        </p>
                      </div>
                      <ProceduresToolbar
                        totalCount={filtered.length}
                        onSearchChange={setSearch}
                        onNewProcedure={() => {
                        setContentSubNav("procedimentos");
                        setEditingProcedure(EMPTY_PROCEDURE);
                      }}
                      />
                      <ProceduresTable
                        procedures={filtered}
                        onEdit={setEditingProcedure}
                        onDelete={handleProcedureDelete}
                        onDeactivate={handleProcedureDeactivate}
                      />
                    </section>
                  )}
                  {contentSubNav === "conhecimento" && (
                    <KnowledgeContent
                      sources={knowledgeSources}
                      onSourcesChange={setKnowledgeSources}
                      onEdit={setEditingKnowledge}
                      onAddKnowledge={() => setEditingKnowledge(EMPTY_KNOWLEDGE_SOURCE)}
                    />
                  )}
                  {contentSubNav === "performance" && (
                    <PerformanceContent />
                  )}
                </>
              )}
              </div>
            </main>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
