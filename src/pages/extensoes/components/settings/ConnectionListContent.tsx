import type { Connection, Extension } from "../../data";
import { getConnectionStatus } from "../../data";
import { getExtensionLogo, getLocalExtensionLogoUrl } from "../../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../../lib/brandfetch";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";
import { StatusBadge } from "./StatusBadge";

interface ConnectionListContentProps {
  extension: Extension;
  connections: Connection[];
  onSelectConnection: (connection: Connection) => void;
  onAddConnection: () => void;
  onUninstall?: (extensionId: string) => void;
}

function ConnectionIcon({
  extension,
  connection,
}: {
  extension: Extension;
  connection: Connection;
}) {
  const iconUrl = (connection.config?.iconUrl as string) ?? null;
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt=""
        className="h-10 w-10 shrink-0 rounded-[var(--talqui-radius-sm)] object-contain border border-[var(--talqui-border-weak)]"
      />
    );
  }
  const Logo = getExtensionLogo(extension.id);
  if (Logo) {
    return (
      <Logo
        className="h-10 w-10 shrink-0 text-[var(--talqui-text-strong)] rounded-[var(--talqui-radius-sm)] border border-[var(--talqui-border-weak)] p-2"
        aria-hidden
      />
    );
  }
  const localLogoUrl = getLocalExtensionLogoUrl(extension.id);
  const url = localLogoUrl ?? getExtensionLogoUrl(extension);
  return (
    <img
      src={url}
      alt=""
      className="h-10 w-10 shrink-0 rounded-[var(--talqui-radius-sm)] object-contain border border-[var(--talqui-border-weak)]"
    />
  );
}

export function ConnectionListContent({
  extension,
  connections,
  onSelectConnection,
  onAddConnection,
}: ConnectionListContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
            Conexões
          </h2>
          <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
            {connections.length} {connections.length === 1 ? "conexão" : "conexões"} configurada
            {connections.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          size="medium"
          variant="primary"
          onClick={onAddConnection}
          className="shrink-0"
        >
          <Icons.Plus size={18} className="mr-1.5 shrink-0" />
          Nova conexão
        </Button>
      </div>

      <ul className="flex flex-col gap-3">
        {connections.map((conn) => {
          const status = getConnectionStatus(conn);
          const isErrorOrWarning = status === "error" || status === "warning";
          return (
            <li key={conn.id}>
              <button
                type="button"
                onClick={() => onSelectConnection(conn)}
                className={`flex w-full items-center gap-4 rounded-(--talqui-radius-xl) border bg-(--talqui-bg-base) px-4 py-4 text-left transition-colors duration-150 hover:border-(--talqui-border-strong) hover:shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 ${
                  isErrorOrWarning
                    ? "border-amber-300 bg-amber-50/50"
                    : "border-(--talqui-border-weak)"
                }`}
              >
                <ConnectionIcon extension={extension} connection={conn} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-(--talqui-text-strong)">
                    {conn.name}
                  </div>
                  {(conn.config?.subtitle as string) && (
                    <div className="mt-0.5 text-sm text-(--talqui-text-medium)">
                      {conn.config.subtitle as string}
                    </div>
                  )}
                </div>
                <StatusBadge connection={conn} className="shrink-0" />
                <span
                  className="shrink-0 text-(--talqui-text-weak)"
                  aria-hidden
                >
                  ›
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
