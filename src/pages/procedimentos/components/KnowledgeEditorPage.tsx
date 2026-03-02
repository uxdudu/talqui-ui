import { useState } from "react";
import { Icons } from "../../../components/icons";
import { Button } from "../../../components/ui/Button";
import { MarkdownEditor } from "../../../components/ui/MarkdownEditor";
import { stripLeadingHeading } from "../../../lib/markdown-utils";
import type { KnowledgeSource } from "../knowledge-data";

interface KnowledgeEditorPageProps {
  source: KnowledgeSource;
  onBack: () => void;
  onSave: (
    id: string,
    data: { nome: string; content: string; publicar: boolean }
  ) => void;
}

const headerInputClasses =
  "min-h-[40px] flex-1 min-w-0 rounded-(--talqui-radius-sm) border border-transparent bg-transparent px-2 py-2 text-base font-bold leading-6 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) hover:border-(--talqui-border-weak) focus:border-(--talqui-border-strong) focus:bg-(--talqui-bg-base) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong) transition-colors duration-200";

export function KnowledgeEditorPage({
  source,
  onBack,
  onSave,
}: KnowledgeEditorPageProps) {
  const [nome, setNome] = useState(source.nome);
  const [content, setContent] = useState(stripLeadingHeading(source.content));

  const hasChanges = nome !== source.nome || content !== stripLeadingHeading(source.content);

  const handleSaveDraft = () => {
    onSave(source.id, { nome, content, publicar: false });
    onBack();
  };

  const handlePublish = () => {
    onSave(source.id, { nome, content, publicar: true });
    onBack();
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
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do conhecimento"
          className={headerInputClasses}
        />
        <div className="flex shrink-0 items-center gap-2">
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
        </div>
      </header>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto p-6">
        <div className="mx-auto flex w-full max-w-none flex-col gap-6">
          <section className="flex min-h-0 flex-1 flex-col gap-2">
            <label className="text-sm font-semibold leading-5 text-(--talqui-text-strong)">
              Conteúdo
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              layout="split"
              minHeight="min-h-[calc(100vh-260px)]"
            />
          </section>
        </div>
      </main>
    </div>
  );
}
