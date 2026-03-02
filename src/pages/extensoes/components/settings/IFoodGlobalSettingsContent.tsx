import { useState } from "react";
import type { Extension } from "../../data";

interface IFoodGlobalSettingsContentProps {
  extension: Extension;
}

interface OrderAutomationState {
  enabled: boolean;
  type: string;
  message: string;
}

const DEFAULT_AUTOMATIONS: Record<
  "onReceive" | "onConfirm" | "onOutForDelivery" | "onComplete",
  OrderAutomationState
> = {
  onReceive: {
    enabled: true,
    type: "",
    message: "",
  },
  onConfirm: {
    enabled: false,
    type: "",
    message: "",
  },
  onOutForDelivery: {
    enabled: false,
    type: "",
    message: "",
  },
  onComplete: {
    enabled: false,
    type: "",
    message: "",
  },
};

export function IFoodGlobalSettingsContent({
  extension,
}: IFoodGlobalSettingsContentProps) {
  const [autoCloseConversation, setAutoCloseConversation] = useState(true);
  const [identifyOrderId, setIdentifyOrderId] = useState(true);
  const [identifyDocuments, setIdentifyDocuments] = useState(false);

  const [automations, setAutomations] = useState(DEFAULT_AUTOMATIONS);

  const activeAutomationsCount = Object.values(automations).filter(
    (item) => item.enabled
  ).length;

  const handleToggleAutomation = (key: keyof typeof automations) => {
    setAutomations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }));
  };

  const handleAutomationChange = (
    key: keyof typeof automations,
    field: keyof OrderAutomationState,
    value: string
  ) => {
    setAutomations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const renderSwitch = (checked: boolean, onToggle: () => void) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`relative h-5 w-8 shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 ${
        checked
          ? "bg-(--talqui-text-primary)"
          : "bg-(--talqui-text-weak) opacity-60"
      }`}
    >
      <span
        className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm ${
          checked ? "left-4" : "left-1"
        }`}
      />
    </button>
  );

  const renderOrderAutomationRow = (
    key: keyof typeof automations,
    title: string,
    description: string
  ) => {
    const state = automations[key];
    const disabled = !state.enabled;

    return (
      <section className="flex flex-col gap-3 rounded-(--talqui-radius-lg) bg-(--talqui-bg-weaker) px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold leading-5 text-(--talqui-text-strong)">
              {title}
            </h4>
            <p className="mt-0.5 text-xs leading-4 text-(--talqui-text-weak)">
              {description}
            </p>
          </div>
          {renderSwitch(state.enabled, () => handleToggleAutomation(key))}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${key}-type`}
              className="text-xs font-semibold leading-4 text-(--talqui-text-strong)"
            >
              Tipo de automação
            </label>
            <select
              id={`${key}-type`}
              value={state.type}
              onChange={(event) =>
                handleAutomationChange(key, "type", event.target.value)
              }
              disabled={disabled}
              className="min-h-[32px] rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-2 text-xs leading-5 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong) disabled:cursor-not-allowed disabled:bg-(--talqui-bg-base) disabled:text-(--talqui-text-weak)"
            >
              <option value="">Selecione o tipo</option>
              <option value="simple-message">Mensagem de texto simples</option>
              <option value="chatbot">Fluxo de chatbot</option>
              <option value="ai-agent">Agente de IA</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${key}-message`}
              className="text-xs font-semibold leading-4 text-(--talqui-text-strong)"
            >
              Mensagem
            </label>
            <input
              id={`${key}-message`}
              type="text"
              value={state.message}
              onChange={(event) =>
                handleAutomationChange(key, "message", event.target.value)
              }
              disabled={disabled}
              placeholder="Digite a mensagem que será enviada"
              className="min-h-[32px] rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-2 text-xs leading-5 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong) disabled:cursor-not-allowed disabled:bg-(--talqui-bg-base) disabled:text-(--talqui-text-weak)"
            />
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
          Configurações do {extension.name}
        </h2>
        <p className="text-sm leading-5 text-(--talqui-text-medium)">
          Defina padrões de atendimento e automações que serão aplicados a todas
          as lojas conectadas do iFood.
        </p>
      </header>

      <section className="overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-normal) bg-(--talqui-bg-base)">
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold leading-6 text-(--talqui-text-strong)">
              Atividade de Atendimento
            </h3>
            <p className="text-sm leading-5 text-(--talqui-text-weak)">
              Controle como a Talqui gerencia o ciclo de conversas e
              identificadores dos pedidos vindos do iFood.
            </p>

            <div className="mt-2 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-(--talqui-radius-lg) bg-(--talqui-bg-weaker) px-4 py-3">
                <div>
                  <p className="text-sm font-semibold leading-5 text-(--talqui-text-strong)">
                    Encerramento automático de conversas?
                  </p>
                  <p className="mt-0.5 text-xs leading-4 text-(--talqui-text-weak)">
                    Ao finalizar um pedido no iFood a conversa será encerrada na
                    Talqui.
                  </p>
                </div>
                {renderSwitch(autoCloseConversation, () =>
                  setAutoCloseConversation((prev) => !prev)
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-(--talqui-radius-lg) bg-(--talqui-bg-weaker) px-4 py-3">
                <div>
                  <p className="text-sm font-semibold leading-5 text-(--talqui-text-strong)">
                    Identificar ID do pedido?
                  </p>
                  <p className="mt-0.5 text-xs leading-4 text-(--talqui-text-weak)">
                    Adiciona o ID do pedido ao nome dos contatos automaticamente.
                  </p>
                </div>
                {renderSwitch(identifyOrderId, () =>
                  setIdentifyOrderId((prev) => !prev)
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-(--talqui-radius-lg) bg-(--talqui-bg-weaker) px-4 py-3">
                <div>
                  <p className="text-sm font-semibold leading-5 text-(--talqui-text-strong)">
                    Identificar documento dos clientes?
                  </p>
                  <p className="mt-0.5 text-xs leading-4 text-(--talqui-text-weak)">
                    Habilita a Talqui a solicitar informações de documentos dos
                    clientes.
                  </p>
                </div>
                {renderSwitch(identifyDocuments, () =>
                  setIdentifyDocuments((prev) => !prev)
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold leading-6 text-(--talqui-text-strong)">
                  Atualizações de Pedidos
                </h3>
                <p className="text-sm leading-5 text-(--talqui-text-weak)">
                  Envie mensagens automáticas quando o pedido sofrer alguma
                  atualização de estado. Use mensagens de texto simples ou
                  conecte outras extensões como Chatbot ou Agente de IA para
                  automações mais complexas.
                </p>
              </div>
              <span className="text-xs font-semibold text-(--talqui-text-medium)">
                {activeAutomationsCount}/4 automações ativas
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {renderOrderAutomationRow(
                "onReceive",
                "Ao receber pedido",
                "Dispare uma automação quando um novo pedido for recebido."
              )}
              {renderOrderAutomationRow(
                "onConfirm",
                "Ao confirmar pedido",
                "Dispare uma automação quando o pedido for confirmado."
              )}
              {renderOrderAutomationRow(
                "onOutForDelivery",
                "Ao sair para entrega",
                "Dispare uma automação quando o pedido sair para entrega."
              )}
              {renderOrderAutomationRow(
                "onComplete",
                "Ao concluir pedido",
                "Dispare uma automação quando o pedido for concluído."
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

