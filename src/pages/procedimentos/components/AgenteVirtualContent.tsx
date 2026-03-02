import { useState } from "react";
import { Icons } from "../../../components/icons";
import { Button } from "../../../components/ui/Button";

const TOM_OPCOES = [
  { id: "amigavel", label: "Amigável e acolhedor" },
  { id: "formal", label: "Formal e profissional" },
  { id: "tecnico", label: "Técnico e objetivo" },
  { id: "informal", label: "Informal e descontraído" },
] as const;

const inputBaseClasses =
  "min-h-[36px] w-full rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-3 py-2 text-sm leading-5 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong) transition-colors duration-200";

export function AgenteVirtualContent() {
  const [nome, setNome] = useState("");
  const [comportamento, setComportamento] = useState("");
  const [tomId, setTomId] = useState<string>("amigavel");
  const [saudacao, setSaudacao] = useState("");
  const [despedida, setDespedida] = useState("");

  return (
    <div className="mx-auto w-full max-w-none flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
          Configuração do Agente Virtual
        </h2>
        <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
          Defina o nome, comportamento e tom de voz do seu agente de IA. Essas
          configurações orientam como ele atende seus clientes.
        </p>
      </div>

      <div className="overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-normal) bg-(--talqui-bg-base)">
        <div className="flex flex-col gap-6 p-6">
          {/* Identidade */}
          <section className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Identidade
            </h4>
            <p className="text-sm font-normal leading-5 text-(--talqui-text-weak)">
              Dê um nome ao seu agente. Esse nome será exibido nas conversas com
              seus clientes.
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
              <label
                htmlFor="agente-nome"
                className="text-sm font-semibold leading-5 text-(--talqui-text-strong)"
              >
                Nome do agente
              </label>
              <input
                id="agente-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Assistente Talqui, Maria, Bot de vendas"
                className={inputBaseClasses}
              />
            </div>
          </section>

          <div className="h-px w-full shrink-0 bg-(--talqui-border-normal)" />

          {/* Comportamento */}
          <section className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Comportamento e instruções
            </h4>
            <p className="text-sm font-normal leading-5 text-(--talqui-text-weak)">
              Descreva como o agente deve agir: quais objetivos seguir, regras
              gerais e o que evitar.
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
              <label
                htmlFor="agente-comportamento"
                className="text-sm font-semibold leading-5 text-(--talqui-text-strong)"
              >
                Instruções do agente
              </label>
              <textarea
                id="agente-comportamento"
                value={comportamento}
                onChange={(e) => setComportamento(e.target.value)}
                placeholder="Ex: Sempre cumprimente o cliente pelo nome. Priorize resolver dúvidas sobre produtos. Nunca forneça informações confidenciais. Em caso de reclamação, ofereça transferência para um atendente humano."
                rows={6}
                className={`${inputBaseClasses} min-h-[120px] resize-y`}
              />
            </div>
          </section>

          <div className="h-px w-full shrink-0 bg-(--talqui-border-normal)" />

          {/* Tom de voz */}
          <section className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Tom de voz
            </h4>
            <p className="text-sm font-normal leading-5 text-(--talqui-text-weak)">
              Escolha o estilo de comunicação predominante do seu agente.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {TOM_OPCOES.map((opcao) => {
                const isSelected = tomId === opcao.id;
                return (
                  <button
                    key={opcao.id}
                    type="button"
                    onClick={() => setTomId(opcao.id)}
                    role="radio"
                    aria-checked={isSelected}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-(--talqui-radius-lg) border px-4 py-3 text-left text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-(--talqui-text-primary) bg-(--talqui-primary-a10) text-(--talqui-text-primary)"
                        : "border-(--talqui-border-weak) bg-(--talqui-bg-base) text-(--talqui-text-strong) hover:border-(--talqui-border-strong) hover:bg-(--talqui-bg-weaker)"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? "border-(--talqui-text-primary) bg-(--talqui-text-primary)"
                          : "border-(--talqui-border-normal)"
                      }`}
                    >
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    {opcao.label}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="h-px w-full shrink-0 bg-(--talqui-border-normal)" />

          {/* Saudação e despedida */}
          <section className="flex flex-col gap-4">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Mensagens padrão
            </h4>
            <p className="text-sm font-normal leading-5 text-(--talqui-text-weak)">
              Personalize a saudação inicial e a despedida enviadas automaticamente.
            </p>
            <div className="mt-3 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="agente-saudacao"
                  className="text-sm font-semibold leading-5 text-(--talqui-text-strong)"
                >
                  Saudação inicial
                </label>
                <input
                  id="agente-saudacao"
                  type="text"
                  value={saudacao}
                  onChange={(e) => setSaudacao(e.target.value)}
                  placeholder="Ex: Olá! Sou o assistente virtual. Como posso ajudar?"
                  className={inputBaseClasses}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="agente-despedida"
                  className="text-sm font-semibold leading-5 text-(--talqui-text-strong)"
                >
                  Despedida
                </label>
                <input
                  id="agente-despedida"
                  type="text"
                  value={despedida}
                  onChange={(e) => setDespedida(e.target.value)}
                  placeholder="Ex: Foi um prazer ajudar! Qualquer dúvida, estou por aqui."
                  className={inputBaseClasses}
                />
              </div>
            </div>
          </section>
        </div>

        <footer className="flex items-center justify-between border-t border-(--talqui-border-weak) px-6 py-4">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 rounded-(--talqui-radius-sm) px-0 py-1 text-sm font-semibold leading-5 text-(--talqui-text-primary) transition-colors duration-200 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2"
          >
            <Icons.Help size={16} />
            Precisa de ajuda?
          </button>
          <Button size="large" variant="primary">
            Salvar configurações
          </Button>
        </footer>
      </div>
    </div>
  );
}
