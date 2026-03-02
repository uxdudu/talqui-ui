import { useState } from "react";
import { getExtensionLogo } from "../../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../../lib/brandfetch";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";
import type { ConnectionSettingsContentProps } from "./types";

export function IFoodSettingsContent({
  extension,
  connection,
  onConnectionChange,
  onUninstall,
}: ConnectionSettingsContentProps) {
  const storeName = (connection?.config?.storeName as string) ?? "";
  const storeId = (connection?.config?.storeId as string) ?? "";
  const automationsEnabled = (connection?.config?.automationsEnabled as boolean) ?? true;
  const [localStoreName, setLocalStoreName] = useState(storeName || "Minha loja");
  const [localStoreId, setLocalStoreId] = useState(storeId || "");
  const [localAutomations, setLocalAutomations] = useState(automationsEnabled);

  const handleSave = () => {
    onConnectionChange({
      id: connection?.id ?? crypto.randomUUID(),
      extensionId: extension.id,
      name: connection?.name ?? localStoreName,
      config: {
        ...connection?.config,
        storeName: localStoreName,
        storeId: localStoreId,
        automationsEnabled: localAutomations,
      },
    });
  };

  return (
    <div className="flex max-w-[740px] flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
              Configurações da conexão
            </h2>
            <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
              Informações da loja e gestão de automações para esta conexão iFood.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-(--talqui-radius-sm) px-2 py-1 text-sm font-semibold leading-5 text-(--talqui-text-medium)">
            Salvo automaticamente
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-normal) bg-(--talqui-bg-base)">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-(--talqui-border-weak) p-2">
              {(() => {
                const Logo = getExtensionLogo(extension.id);
                if (Logo) {
                  return (
                    <Logo
                      className="h-8 w-8 shrink-0 text-(--talqui-text-strong)"
                      aria-hidden
                    />
                  );
                }
                return (
                  <img
                    src={getExtensionLogoUrl(extension)}
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                );
              })()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-(--talqui-text-strong)">
                {connection?.name ?? "Nova conexão"} — {extension.name}
              </h3>
              <p className="mt-0.5 text-sm text-(--talqui-text-medium)">
                Cada conexão pode ser uma loja ou canal iFood diferente.
              </p>
            </div>
          </div>

          <section className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Informações da loja
            </h4>
            <p className="text-sm text-(--talqui-text-weak)">
              Nome e identificador da loja no iFood para esta conexão.
            </p>
            <div className="mt-3 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ifood-store-name"
                  className="text-sm font-semibold leading-5 text-(--talqui-text-strong)"
                >
                  Nome da loja
                </label>
                <input
                  id="ifood-store-name"
                  type="text"
                  value={localStoreName}
                  onChange={(e) => setLocalStoreName(e.target.value)}
                  onBlur={handleSave}
                  placeholder="Ex.: Restaurante Centro"
                  className="min-h-[36px] rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-2 py-2 text-sm leading-5 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong)"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ifood-store-id"
                  className="text-sm font-semibold leading-5 text-(--talqui-text-strong)"
                >
                  ID da loja no iFood
                </label>
                <input
                  id="ifood-store-id"
                  type="text"
                  value={localStoreId}
                  onChange={(e) => setLocalStoreId(e.target.value)}
                  onBlur={handleSave}
                  placeholder="Opcional — para integração via API"
                  className="min-h-[36px] rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-2 py-2 text-sm leading-5 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong)"
                />
              </div>
            </div>
          </section>

          <div className="h-px w-full shrink-0 bg-(--talqui-border-normal)" />

          <section className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Gestão de automações
            </h4>
            <p className="text-sm text-(--talqui-text-weak)">
              Ative ou desative respostas e fluxos automáticos para esta loja.
            </p>
            <div className="mt-3 flex flex-col gap-4 rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-(--talqui-text-strong)">
                    Automações ativas
                  </p>
                  <p className="text-xs text-(--talqui-text-weak)">
                    Respostas automáticas, confirmação de pedidos e notificações
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localAutomations}
                  onClick={() => {
                    setLocalAutomations(!localAutomations);
                    onConnectionChange({
                      id: connection?.id ?? crypto.randomUUID(),
                      extensionId: extension.id,
                      name: connection?.name ?? localStoreName,
                      config: {
                        ...connection?.config,
                        storeName: localStoreName,
                        storeId: localStoreId,
                        automationsEnabled: !localAutomations,
                      },
                    });
                  }}
                  className={`relative h-5 w-8 shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 ${
                    localAutomations
                      ? "bg-(--talqui-text-primary)"
                      : "bg-(--talqui-text-weak) opacity-60"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm ${
                      localAutomations ? "left-4" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>
        <footer className="flex items-center border-t border-(--talqui-border-weak) px-6 py-3">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-(--talqui-radius-sm) px-0 py-1 text-sm font-semibold leading-5 text-(--talqui-text-primary) hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2"
          >
            <Icons.Help size={16} />
            Precisa de ajuda?
          </button>
        </footer>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button size="large" variant="primary" onClick={handleSave}>
          Salvar alterações
        </Button>
        <Button size="large" variant="secondary">
          Ver vídeo
        </Button>
        <Button
          size="large"
          variant="danger"
          onClick={() => onUninstall?.(extension.id)}
        >
          Desinstalar
        </Button>
      </div>
    </div>
  );
}
