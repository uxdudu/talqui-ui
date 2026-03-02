import { Icons } from "../../../components/icons";
import { Button } from "../../../components/ui/Button";

interface ConversationEmptyStateProps {
  onNewConversation?: () => void;
}

export function ConversationEmptyState({
  onNewConversation,
}: ConversationEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12">
      <div className="flex h-24 w-24 items-center justify-center rounded-[var(--talqui-radius-xl)] bg-[var(--talqui-bg-weaker)]">
        <Icons.Chat size={48} className="text-[var(--talqui-text-primary)] opacity-80" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-base font-bold leading-6 text-[var(--talqui-text-strong)]">
          Nenhuma conversa
        </h2>
        <p className="text-sm leading-5 text-[var(--talqui-text-medium)]">
          Não há conversas na fila de atendimento
        </p>
      </div>
      <Button
        size="medium"
        variant="secondaryOutline"
        onClick={onNewConversation}
      >
        + Nova Conversa
      </Button>
    </div>
  );
}
