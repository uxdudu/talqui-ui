import type { Extension } from "../data";
import { getExtensionLogo, getLocalExtensionLogoUrl } from "../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../lib/brandfetch";
import { Button } from "../../../components/ui/Button";
import { Icons } from "../../../components/icons/Icons";
import { getExtensionOverallStatus } from "./settings/extension-status-data";

interface ExtensionCardProps {
  extension: Extension;
  /** Número de conexões desta extensão (exibido quando a extensão é multi connection). */
  connectionCount?: number;
  onToggle: (id: string, enabled: boolean) => void;
  onSettings?: (id: string) => void;
  onDetails: (id: string) => void;
  /** Chamado ao clicar em "Instalar" (apenas quando a extensão não está instalada). */
  onInstall?: (id: string) => void;
}

export function ExtensionCard({
  extension,
  connectionCount = 0,
  onToggle,
  onSettings,
  onDetails: _onDetails,
  onInstall,
}: ExtensionCardProps) {
  const isInstalled = extension.installed !== false;
  const isMulti = extension.allowsMultipleConnections === true;
  const showConnectionCount = isMulti;
  const serviceStatus = getExtensionOverallStatus(extension.id);
  const showServiceStatusBadge = serviceStatus === "outage" || serviceStatus === "degraded";
  const priceLabel =
    extension.price.type === "free"
      ? "Grátis"
      : extension.price.type === "trial"
        ? `Mín. ${extension.price.minDays} dias`
        : `R$ ${extension.price.value} /mês`;

  const isFree = extension.price.type === "free";
  const isTrial = extension.price.type === "trial";

  return (
    <article
      className={`flex min-h-[276px] min-w-[318px] w-full flex-1 flex-col justify-between overflow-hidden rounded-[var(--talqui-radius-xl)] border bg-[var(--talqui-bg-base)] ${
        serviceStatus === "outage"
          ? "border-red-200 bg-red-50/30"
          : serviceStatus === "degraded"
            ? "border-amber-200 bg-amber-50/20"
            : "border-[var(--talqui-border-weak)]"
      }`}
    >
      <div className="relative flex flex-1 flex-col gap-4 p-5">
        {/* Badge: serviço fora do ar / degradado */}
        {showServiceStatusBadge && (
          <div className="flex items-center gap-1.5 rounded-[var(--talqui-radius-sm)] px-2 py-1.5 text-xs font-semibold w-fit">
            {serviceStatus === "outage" ? (
              <>
                <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
                <span className="text-red-700">Fora do ar</span>
              </>
            ) : (
              <>
                <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                <span className="text-amber-800">Serviço degradado</span>
              </>
            )}
          </div>
        )}
        {/* Badges: quando instalado = tag Instalado + preço; quando não = só preço */}
        <div className="absolute right-[19.5px] top-[19.5px] flex items-center gap-2">
          {isInstalled && (
            <span className="flex h-5 items-center gap-1.5 text-[10px] font-thin leading-[12px] text-(--talqui-text-medium)">
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-(--talqui-text-medium)" aria-hidden>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6l3 3 5-6" />
                </svg>
              </span>
              Instalado
            </span>
          )}
          <div
            className={`flex h-5 min-w-[20px] items-center justify-center gap-0.5 rounded-[var(--talqui-radius-full)] px-2 py-1 ${
              isFree
                ? "bg-[var(--talqui-green-a10)] text-[var(--talqui-text-success)]"
                : isTrial
                  ? "border border-[var(--talqui-border-weak)] bg-[var(--talqui-bg-base)] text-[var(--talqui-text-strong)]"
                  : "border border-[var(--talqui-border-weak)] bg-[var(--talqui-bg-base)] text-[var(--talqui-text-strong)]"
            }`}
          >
          {isFree ? (
            <span className="text-xs font-normal leading-4 text-[var(--talqui-text-success)]">{priceLabel}</span>
          ) : (
            <>
              {isTrial ? (
                <span className="text-xs font-semibold leading-4">{priceLabel}</span>
              ) : (
                <>
                  <span className="text-xs font-normal text-[var(--talqui-text-strong)]">R$</span>
                  <span className="text-xs font-normal leading-4">
                    {extension.price.type === "paid"
                      ? extension.price.value
                      : ""}
                  </span>
                  <span className="text-xs font-normal leading-4 text-[var(--talqui-text-weak)]">
                    /mês
                  </span>
                </>
              )}
            </>
          )}
        </div>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[var(--talqui-radius-sm)] border border-[var(--talqui-border-weak)] p-0">
          {(() => {
            const Logo = getExtensionLogo(extension.id);
            if (Logo) {
              return (
                <Logo
                  className="h-full w-full shrink-0 text-[var(--talqui-text-strong)]"
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
                className="h-full w-full object-contain"
              />
            );
          })()}
        </div>
        <div className="flex flex-1 min-h-0 flex-col gap-2">
          <h3 className="text-lg font-bold leading-7 text-[var(--talqui-text-strong)] shrink-0">
            {extension.name}
          </h3>
          <div className="min-h-[4rem] flex flex-col gap-2">
            <p className="line-clamp-2 text-sm leading-5 text-[var(--talqui-text-medium)]">
              {extension.description}
            </p>
            {showConnectionCount ? (
              <p className="text-xs leading-4 text-[var(--talqui-text-weak)] shrink-0">
                {connectionCount === 0
                  ? "Nenhuma conexão"
                  : connectionCount === 1
                    ? "1 conexão"
                    : `${connectionCount} conexões`}
              </p>
            ) : (
              <span className="block h-4 shrink-0" aria-hidden />
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-[var(--talqui-border-weak)] py-4 px-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={extension.enabled}
            aria-label={extension.enabled ? "Desativar extensão" : "Ativar extensão"}
            title={extension.enabled ? "Desativar extensão" : "Ativar extensão"}
            onClick={() => onToggle(extension.id, !extension.enabled)}
            className={`relative h-5 w-8 shrink-0 rounded-[var(--talqui-radius-full)] transition-colors duration-200 ${
              extension.enabled
                ? "bg-[var(--talqui-text-primary)]"
                : "bg-[var(--talqui-text-weak)] opacity-60"
            }`}
          >
            <span
              className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-[left] duration-200 ${
                extension.enabled ? "left-4" : "left-1"
              }`}
            />
          </button>
          {isInstalled && (
            <span
              className={`text-xs leading-4 ${
                extension.enabled
                  ? "text-[var(--talqui-text-strong)]"
                  : "text-[var(--talqui-text-weak)]"
              }`}
            >
              {extension.enabled ? "Ativo" : "Inativo"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isInstalled ? (
            <Button
              size="small"
              variant="primaryOutline"
              onClick={() => onInstall?.(extension.id)}
            >
              Instalar
            </Button>
          ) : (
            <>
              <Button
                size="small"
                variant="secondary"
                onClick={() => onSettings?.(extension.id)}
              >
                Configurações
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
