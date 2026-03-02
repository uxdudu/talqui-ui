import type { Connection, Extension } from "../data";
import { Icons } from "../../../components/icons";
import {
  ConnectionListContent,
  ConnectionSettingsRouter,
} from "./settings";

interface ExtensionSettingsPageProps {
  extension: Extension;
  connections: Connection[];
  selectedConnectionId: string | null;
  onBack: () => void;
  /** Quando em extensão com múltiplas conexões, voltar da tela de uma conexão para a lista. */
  onBackToList?: () => void;
  onSelectConnection: (connection: Connection) => void;
  onAddConnection: () => void;
  onConnectionChange: (connection: Connection) => void;
  onUninstall?: (extensionId: string) => void;
}

const SETTINGS_MENU_ITEMS = [
  { id: "conexao", label: "Conexão" },
  { id: "parametros", label: "Parâmetros" },
  { id: "permissoes", label: "Permissões" },
] as const;

export function ExtensionSettingsPage({
  extension,
  connections,
  selectedConnectionId,
  onBack,
  onBackToList,
  onSelectConnection,
  onAddConnection,
  onConnectionChange,
  onUninstall,
}: ExtensionSettingsPageProps) {
  const allowsMultiple = extension.allowsMultipleConnections === true;
  const showList = allowsMultiple && selectedConnectionId === null;
  const selectedConnection = selectedConnectionId
    ? connections.find((c) => c.id === selectedConnectionId)
    : !allowsMultiple
      ? connections[0]
      : undefined;

  const handleBackClick = () => {
    if (allowsMultiple && selectedConnectionId !== null) {
      onBackToList?.();
    } else {
      onBack();
    }
  };

  const handleConnectionChange = (
    partial: Partial<Connection> & { id: string; extensionId: string }
  ) => {
    const existing = connections.find((c) => c.id === partial.id);
    const next: Connection = {
      id: partial.id,
      extensionId: partial.extensionId,
      name: partial.name ?? existing?.name ?? extension.name,
      config: partial.config ?? existing?.config ?? {},
      connected: partial.connected ?? existing?.connected,
      createdAt: existing?.createdAt,
    };
    onConnectionChange(next);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-4 border-b border-(--talqui-border-weak) bg-(--talqui-bg-base) px-4 py-1 min-h-[60px] max-h-[64px]">
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex shrink-0 items-center justify-center rounded-(--talqui-radius-sm) p-2 min-h-[44px] min-w-[44px] text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker) cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2"
            aria-label="Voltar"
          >
            <Icons.ArrowLeft size={20} />
          </button>
          <h1 className="truncate text-base font-bold leading-6 text-(--talqui-text-medium)">
            {showList
              ? `Configurações — ${extension.name}`
              : selectedConnection
                ? `${selectedConnection.name} — ${extension.name}`
                : `Nova conexão — ${extension.name}`}
          </h1>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {!showList && (
          <nav className="flex w-[252px] shrink-0 flex-col gap-1 self-stretch overflow-auto border-r border-(--talqui-border-weak) bg-(--talqui-bg-base) px-[18px] py-4">
            {SETTINGS_MENU_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex h-10 min-h-[44px] items-center gap-1.5 rounded-(--talqui-radius-lg) px-3 py-3 text-sm font-semibold leading-5 text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker) data-active:bg-(--talqui-bg-weaker) data-active:text-(--talqui-text-primary) cursor-pointer"
                data-active={item.id === "conexao" ? true : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col justify-start items-center overflow-auto">
          <div className="mx-auto w-full max-w-(--talqui-main-max-w) flex flex-1 flex-col justify-start items-center gap-8 px-10 py-8">
            {showList ? (
              <ConnectionListContent
                extension={extension}
                connections={connections}
                onSelectConnection={onSelectConnection}
                onAddConnection={onAddConnection}
                onUninstall={onUninstall}
              />
            ) : (
              <ConnectionSettingsRouter
                extension={extension}
                connection={selectedConnection}
                onConnectionChange={handleConnectionChange}
                onUninstall={onUninstall}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
