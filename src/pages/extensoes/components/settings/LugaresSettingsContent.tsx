import { useState } from "react";
import { getExtensionLogo } from "../../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../../lib/brandfetch";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";
import type { ConnectionSettingsContentProps } from "./types";

type Region = { id: string; name: string; active: boolean };

export function LugaresSettingsContent({
  extension,
  connection,
  onConnectionChange,
  onUninstall,
}: ConnectionSettingsContentProps) {
  const regionsFromConfig = (connection?.config?.regions as Region[] | undefined) ?? [];
  const [regions, setRegions] = useState<Region[]>(
    regionsFromConfig.length > 0
      ? regionsFromConfig
      : [
          { id: "1", name: "Sudeste", active: true },
          { id: "2", name: "Sul", active: true },
          { id: "3", name: "Nordeste", active: false },
        ]
  );

  const handleToggleRegion = (id: string, active: boolean) => {
    const next = regions.map((r) => (r.id === id ? { ...r, active } : r));
    setRegions(next);
    onConnectionChange({
      id: connection?.id ?? crypto.randomUUID(),
      extensionId: extension.id,
      name: connection?.name ?? "Lugares",
      config: { ...connection?.config, regions: next },
    });
  };

  const handleAddRegion = () => {
    const newRegion: Region = {
      id: crypto.randomUUID(),
      name: `Região ${regions.length + 1}`,
      active: true,
    };
    const next = [...regions, newRegion];
    setRegions(next);
    onConnectionChange({
      id: connection?.id ?? crypto.randomUUID(),
      extensionId: extension.id,
      name: connection?.name ?? "Lugares",
      config: { ...connection?.config, regions: next },
    });
  };

  return (
    <div className="flex max-w-[740px] flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
              Configurações da extensão
            </h2>
            <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
              Defina as regiões disponíveis para consulta e envio de localização no atendimento.
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
                {extension.name}
              </h3>
              <p className="mt-0.5 text-sm text-(--talqui-text-medium)">
                Configure regiões para filtrar lugares e endereços no atendimento.
              </p>
            </div>
          </div>

          <section className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Regiões
            </h4>
            <p className="text-sm text-(--talqui-text-weak)">
              Ative ou desative as regiões que podem ser usadas no painel.
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {regions.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-4 py-3"
                >
                  <span className="text-sm font-semibold text-(--talqui-text-strong)">
                    {r.name}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={r.active}
                    onClick={() => handleToggleRegion(r.id, !r.active)}
                    className={`relative h-5 w-8 shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 ${
                      r.active
                        ? "bg-(--talqui-text-primary)"
                        : "bg-(--talqui-text-weak) opacity-60"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm ${
                        r.active ? "left-4" : "left-1"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <Button
              size="medium"
              variant="secondary"
              onClick={handleAddRegion}
              className="mt-2"
            >
              <Icons.Plus size={18} className="mr-1.5 shrink-0" />
              Adicionar região
            </Button>
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
