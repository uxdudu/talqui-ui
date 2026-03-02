import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";

interface SaveBarProps {
  /** Modelo Multi: exibe botão "Voltar para conexões" à esquerda. */
  isMulti?: boolean;
  onBackToList?: () => void;
  onSave?: () => void;
  saving?: boolean;
}

export function SaveBar({
  isMulti = false,
  onBackToList,
  onSave,
  saving = false,
}: SaveBarProps) {
  return (
    <footer
      className="flex shrink-0 items-center justify-between gap-4 border-t border-(--talqui-border-weak) bg-(--talqui-bg-base) px-6 py-4"
      role="region"
      aria-label="Ações de salvamento"
    >
      <div className="flex items-center gap-2">
        {isMulti && onBackToList && (
          <Button
            size="medium"
            variant="ghost"
            onClick={onBackToList}
            className="text-(--talqui-text-medium)"
          >
            <Icons.ArrowLeft size={18} className="mr-1.5 shrink-0" />
            Voltar para conexões
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onSave && (
          <Button
            size="large"
            variant="primary"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Salvando…
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        )}
      </div>
    </footer>
  );
}
