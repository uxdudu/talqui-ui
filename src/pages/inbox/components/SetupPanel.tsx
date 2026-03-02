import { Icons } from "../../../components/icons";
import { Button } from "../../../components/ui/Button";
import type { SetupStep } from "../data";

import logoTalqui from "../../../assets/Logo.svg";

interface SetupPanelProps {
  steps: SetupStep[];
  onConfigure?: (id: string) => void;
}

export function SetupPanel({ steps, onConfigure }: SetupPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex shrink-0 flex-col gap-4 border-b border-[var(--talqui-border-weak)] px-6 pt-8 pb-6">
        <div className="flex items-center justify-center">
          <img
            src={logoTalqui}
            alt="Talqui"
            className="h-7 w-auto"
          />
        </div>
        <h2 className="text-lg font-bold leading-7 text-[var(--talqui-text-strong)]">
          Preparar, treinar, atender!
        </h2>
        <p className="text-sm leading-5 text-[var(--talqui-text-medium)]">
          Tire o máximo proveito da sua conta Talqui seguindo estas etapas de
          configuração. Seu trabalho fica mais fácil a cada etapa concluída.
        </p>
      </div>
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="grid gap-4">
          {steps.map((step) => (
            <SetupCard
              key={step.id}
              step={step}
              onConfigure={() => onConfigure?.(step.id)}
            />
          ))}
        </div>
        <a
          href="#ajuda"
          className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--talqui-text-primary)] hover:underline cursor-pointer"
        >
          <Icons.Help size={20} className="shrink-0 opacity-80" />
          Precisa de ajuda para configurar algo?
        </a>
      </div>
    </div>
  );
}

function SetupCard({
  step,
  onConfigure,
}: {
  step: SetupStep;
  onConfigure: () => void;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-[var(--talqui-radius-xl)] border border-[var(--talqui-border-weak)] bg-white p-4">
      <div className="flex gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--talqui-radius-sm)] ${
            step.iconType === "message"
              ? "bg-[#F97316]/10 text-[#F97316]"
              : "bg-[var(--talqui-green-a10)] text-[var(--talqui-green-500)]"
          }`}
        >
          {step.iconType === "message" ? (
            <Icons.ChatBubble size={24} />
          ) : (
            <Icons.CheckCircle size={24} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-6 text-[var(--talqui-text-strong)]">
            {step.title}
          </h3>
          <p className="text-sm leading-5 text-[var(--talqui-text-medium)]">
            {step.description}
          </p>
        </div>
      </div>
      {step.configured ? (
        <Button
          disabled
          size="medium"
          variant="disabled"
          className="w-fit"
        >
          Já está configurado!
        </Button>
      ) : (
        <Button
          size="medium"
          variant="secondaryOutline"
          className="w-fit"
          onClick={onConfigure}
        >
          Configurar agora
        </Button>
      )}
    </article>
  );
}
