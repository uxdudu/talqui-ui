import { useState, useEffect, useRef } from "react";
import { getExtensionLogo, getLocalExtensionLogoUrl } from "../../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../../lib/brandfetch";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";
import type { ConnectionSettingsContentProps } from "./types";

export function IFoodSettingsContent({
  extension,
  connection,
  onConnectionChange,
  registerSaveHandler,
  hideContentHeader = false,
  activeTabId = "loja",
}: ConnectionSettingsContentProps) {
  const storeName = (connection?.config?.storeName as string) ?? "";
  const storeId = (connection?.config?.storeId as string) ?? "";
  const storeType = (connection?.config?.storeType as string) ?? "Mercado";
  const storeAddress = (connection?.config?.storeAddress as string) ?? "";
  const serviceUser = (connection?.config?.serviceUser as string) ?? "";
  const accessedInfo =
    (connection?.config?.accessedInfo as string) ??
    "Dados básicos da loja, mensagens e atualizações de pedidos.";
  const automationsEnabled = (connection?.config?.automationsEnabled as boolean) ?? true;
  const [localStoreName, setLocalStoreName] = useState(storeName || "Minha loja");
  const [localStoreId, setLocalStoreId] = useState(storeId || "");
  const [localAutomations, setLocalAutomations] = useState(automationsEnabled);
  const [isConnecting, setIsConnecting] = useState(false);

  const connected =
    (connection?.connected ?? false) || connection?.status === "connected";

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

  const saveFnRef = useRef(handleSave);
  saveFnRef.current = handleSave;
  useEffect(() => {
    registerSaveHandler?.(() => saveFnRef.current());
  }, [registerSaveHandler]);

  const handleCancel = () => {
    setLocalStoreName(storeName || "Minha loja");
    setLocalStoreId(storeId ?? "");
    setLocalAutomations(automationsEnabled);
  };

  const handleDisconnect = () => {
    if (!connection) return;
    onConnectionChange({
      id: connection.id,
      extensionId: extension.id,
      name: connection.name,
      config: {
        ...connection.config,
      },
      connected: false,
      status: "disconnected",
    });
  };

  const handleConnect = () => {
    if (connected || isConnecting) return;
    setIsConnecting(true);
    window.setTimeout(() => {
      setIsConnecting(false);
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
        connected: true,
        status: "connected",
      });
    }, 1500);
  };

  if (isConnecting) {
    return (
      <div className="flex max-w-[740px] flex-col gap-6">
        {!hideContentHeader && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
                  Conectando ao iFood
                </h2>
                <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
                  Estamos redirecionando para concluir a conexão desta loja com o iFood.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-normal) bg-(--talqui-bg-base)">
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--talqui-bg-weaker)">
              <Icons.Refresh
                size={26}
                className="animate-spin text-(--talqui-text-primary)"
              />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-(--talqui-text-strong)">
                Conectando sua loja…
              </h3>
              <p className="mt-1 text-sm text-(--talqui-text-medium)">
                Isso leva apenas alguns segundos. Assim que finalizar, a conexão será
                marcada como conectada.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[740px] flex-col gap-6">
      {!hideContentHeader && (
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
      )}

      <div className="overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-normal) bg-(--talqui-bg-base)">
        <div className="flex flex-col gap-6 p-6">
          {!hideContentHeader && (
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
                  const localLogoUrl = getLocalExtensionLogoUrl(extension.id);
                  const logoUrl = localLogoUrl ?? getExtensionLogoUrl(extension);
                  return (
                    <img
                      src={logoUrl}
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
          )}

          <section className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Status da conexão
            </h4>
            <p className="text-sm text-(--talqui-text-weak)">
              Conecte esta loja do iFood para receber pedidos e notificações na Talqui.
            </p>
            <div className="mt-3 flex flex-col gap-4 rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    connected
                      ? "bg-(--talqui-green-a10) text-(--talqui-text-success)"
                      : "bg-(--talqui-bg-weaker) text-(--talqui-text-weak)"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      connected ? "bg-(--talqui-green-500)" : "bg-current"
                    }`}
                    aria-hidden
                  />
                  {connected ? "Conectado" : "Desconectado"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-(--talqui-text-strong)">
                    {connected ? "Loja conectada ao iFood" : "Nenhuma loja conectada"}
                  </p>
                  <p className="text-xs text-(--talqui-text-weak)">
                    {connected
                      ? "Pedidos e atualizações serão sincronizados automaticamente."
                      : "Clique em Conectar para iniciar a integração desta loja."}
                  </p>
                </div>
              </div>
              <Button
                size="large"
                variant={connected ? "secondary" : "primary"}
                onClick={connected ? handleDisconnect : handleConnect}
              >
                {connected ? "Desconectar" : "Conectar"}
              </Button>
            </div>
          </section>

          {(activeTabId === "loja" || !activeTabId) && (
            <section id="loja" className="flex flex-col gap-2">
              <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
                Informações da loja
              </h4>
              <p className="text-sm text-(--talqui-text-weak)">
                Dados de identificação desta loja no iFood para esta conexão.
              </p>
              <div className="mt-3 overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-weak) bg-(--talqui-bg-base)">
                <div className="rounded-[inherit] bg-(--talqui-bg-weaker) px-6 py-5">
                  <dl className="grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-(--talqui-text-weak)">
                        Tipo de Loja
                      </dt>
                      <dd className="text-sm text-(--talqui-text-strong)">
                        {storeType}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-(--talqui-text-weak)">
                        Nome da Loja
                      </dt>
                      <dd className="text-sm text-(--talqui-text-strong)">
                        {storeName || connection?.name || "—"}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-(--talqui-text-weak)">
                        Endereço da Loja
                      </dt>
                      <dd className="text-sm text-(--talqui-text-strong)">
                        {storeAddress || "—"}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-(--talqui-text-weak)">
                        Usuário de serviço
                      </dt>
                      <dd className="text-sm font-mono text-(--talqui-text-strong)">
                        {serviceUser || "—"}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-(--talqui-text-weak)">
                        Informações acessadas pela Talqui
                      </dt>
                      <dd className="text-sm text-(--talqui-text-strong)">
                        {accessedInfo}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>
          )}

          {activeTabId === "automacoes" && (
            <section id="automacoes" className="flex flex-col gap-2">
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
          )}
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        {!registerSaveHandler && (
          <div className="flex items-center gap-2">
            <Button size="large" variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button size="large" variant="primary" onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
