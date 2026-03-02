import type { Extension } from "../data";
import { getExtensionLogo } from "../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../lib/brandfetch";
import { Button } from "../../../components/ui/Button";

interface ExtensionCardProps {
  extension: Extension;
  onToggle: (id: string, enabled: boolean) => void;
  onSettings?: (id: string) => void;
  onDetails: (id: string) => void;
}

export function ExtensionCard({
  extension,
  onToggle,
  onSettings,
  onDetails,
}: ExtensionCardProps) {
  const priceLabel =
    extension.price.type === "free"
      ? "Grátis"
      : extension.price.type === "trial"
        ? `Mín. ${extension.price.minDays} dias`
        : `R$ ${extension.price.value} /mês`;

  const isFree = extension.price.type === "free";
  const isTrial = extension.price.type === "trial";

  return (
    <article className="flex min-h-[276px] min-w-[318px] w-full flex-1 flex-col overflow-hidden rounded-[var(--talqui-radius-xl)] border border-[var(--talqui-border-weak)] bg-white">
      <div className="relative flex flex-1 flex-col gap-4 p-5">
        {/* Badge */}
        <div
          className={`absolute right-5 top-5 flex h-5 min-w-[20px] items-center justify-center gap-0.5 rounded-full px-2 py-1 ${
            isFree
              ? "bg-[var(--talqui-green-a10)] text-[var(--talqui-text-success)]"
              : isTrial
                ? "border border-[var(--talqui-border-weak)] bg-white text-[var(--talqui-text-strong)]"
                : "border border-[var(--talqui-border-weak)] bg-white text-[var(--talqui-text-strong)]"
          }`}
        >
          {isFree ? (
            <span className="text-xs font-bold">{priceLabel}</span>
          ) : (
            <>
              {isTrial ? (
                <span className="text-xs font-bold">{priceLabel}</span>
              ) : (
                <>
                  <span className="text-xs font-bold">R$</span>
                  <span className="text-xs font-normal">
                    {extension.price.type === "paid"
                      ? extension.price.value
                      : ""}
                  </span>
                  <span className="text-xs font-normal text-[var(--talqui-text-weak)]">
                    /mês
                  </span>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[var(--talqui-radius-sm)] border border-[var(--talqui-border-weak)] p-3">
          {(() => {
            const Logo = getExtensionLogo(extension.id);
            if (Logo) {
              return (
                <Logo
                  className="h-5 w-5 shrink-0 text-[var(--talqui-text-strong)]"
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
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="text-lg font-bold leading-7 text-[var(--talqui-text-strong)]">
            {extension.name}
          </h3>
          <p className="line-clamp-3 text-sm leading-5 text-[var(--talqui-text-medium)]">
            {extension.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--talqui-border-weak)] p-5">
        <button
          type="button"
          role="switch"
          aria-checked={extension.enabled}
          aria-label={extension.enabled ? "Desativar extensão" : "Ativar extensão"}
          title={extension.enabled ? "Desativar extensão" : "Ativar extensão"}
          onClick={() => onToggle(extension.id, !extension.enabled)}
          className={`relative h-5 w-8 shrink-0 rounded-full transition-colors ${
            extension.enabled
              ? "bg-[var(--talqui-text-primary)]"
              : "bg-[var(--talqui-text-weak)] opacity-60"
          }`}
        >
          <span
            className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-left ${
              extension.enabled ? "left-4" : "left-1"
            }`}
          />
        </button>
        <div className="flex items-center gap-4">
          {extension.showSettings && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => onSettings?.(extension.id)}
            >
              Configurações
            </Button>
          )}
          <Button size="small" variant="secondary" onClick={() => onDetails(extension.id)}>
            Detalhes
          </Button>
        </div>
      </div>
    </article>
  );
}
