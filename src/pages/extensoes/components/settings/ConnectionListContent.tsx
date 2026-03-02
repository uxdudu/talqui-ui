import type { Connection, Extension } from "../../data";
import { getExtensionLogo } from "../../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../../lib/brandfetch";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";

interface ConnectionListContentProps {
  extension: Extension;
  connections: Connection[];
  onSelectConnection: (connection: Connection) => void;
  onAddConnection: () => void;
  onUninstall?: (extensionId: string) => void;
}

export function ConnectionListContent({
  extension,
  connections,
  onSelectConnection,
  onAddConnection,
  onUninstall,
}: ConnectionListContentProps) {
  return (
    <div className="flex max-w-[740px] flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
              Conexões — {extension.name}
            </h2>
            <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
              Esta extensão permite várias conexões. Escolha uma para editar ou crie uma nova.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-normal) bg-(--talqui-bg-base)">
        <div className="flex flex-col gap-4 p-6">
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
                {connections.length} conexão(ões) configurada(s)
              </p>
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {connections.map((conn) => (
              <li
                key={conn.id}
                className="flex items-center justify-between rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-4 py-3 transition-colors hover:bg-(--talqui-bg-weaker)"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      conn.connected ? "bg-(--talqui-green-500)" : "bg-(--talqui-text-weak)"
                    }`}
                    aria-hidden
                  />
                  <span className="truncate text-sm font-semibold text-(--talqui-text-strong)">
                    {conn.name}
                  </span>
                  {conn.connected && (
                    <span className="shrink-0 text-xs font-semibold text-(--talqui-text-success)">
                      Conectado
                    </span>
                  )}
                </div>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => onSelectConnection(conn)}
                >
                  Configurar
                </Button>
              </li>
            ))}
          </ul>

          <Button
            size="medium"
            variant="secondary"
            onClick={onAddConnection}
            className="w-full sm:w-auto"
          >
            <Icons.Plus size={18} className="mr-1.5 shrink-0" />
            Nova conexão
          </Button>
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
