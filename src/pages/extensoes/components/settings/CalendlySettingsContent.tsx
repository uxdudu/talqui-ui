import { getExtensionLogo, getLocalExtensionLogoUrl } from "../../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../../lib/brandfetch";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";
import type { ConnectionSettingsContentProps } from "./types";

export function CalendlySettingsContent({
  extension,
  connection,
  onConnectionChange,
  onUninstall,
  hideContentHeader = false,
}: ConnectionSettingsContentProps) {
  const connected = connection?.connected ?? false;

  const handleConnect = () => {
    onConnectionChange({
      id: connection?.id ?? crypto.randomUUID(),
      extensionId: extension.id,
      name: connection?.name ?? "Conta Calendly",
      config: connection?.config ?? {},
      connected: !connected,
    });
  };

  return (
    <div className="flex max-w-[740px] flex-col gap-6">
      {!hideContentHeader && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
                Configurações da extensão
              </h2>
              <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
                Autentique sua conta Calendly. Ao conectar, você poderá usar sua agenda na Talqui.
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
                  {extension.name}
                </h3>
                <p className="mt-0.5 text-sm text-(--talqui-text-medium)">
                  Acesse sua conta Calendly para agendar reuniões direto no atendimento.
                </p>
              </div>
            </div>
          )}

          <section className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Autenticação
            </h4>
            <p className="text-sm text-(--talqui-text-weak)">
              Você será redirecionado ao Calendly para autorizar o acesso. Depois, volte aqui e use a extensão normalmente.
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
                    {connected ? "Conta Calendly conectada" : "Nenhuma conta conectada"}
                  </p>
                  <p className="text-xs text-(--talqui-text-weak)">
                    {connected
                      ? "Sua agenda está disponível no painel"
                      : "Conecte para usar sua agenda na Talqui"}
                  </p>
                </div>
              </div>
              <Button size="large" variant="secondary" onClick={handleConnect}>
                {connected ? "Desconectar" : "Conectar minha conta"}
              </Button>
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

      <div className="flex flex-wrap items-center justify-between gap-3">
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
