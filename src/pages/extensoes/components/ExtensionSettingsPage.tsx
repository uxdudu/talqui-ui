import type { Connection, Extension } from "../data";
import { useRef, useState, useEffect } from "react";
import {
  ConfigHeader,
  ConnectionListContent,
  ConnectionSettingsRouter,
  IFoodGlobalSettingsContent,
  SaveBar,
} from "./settings";
import { getSettingsTabs } from "./settings/settings-tabs";

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
  const saveHandlerRef = useRef<(() => void) | null>(null);
  const allowsMultiple = extension.allowsMultipleConnections === true;
  const showList = allowsMultiple && selectedConnectionId === null;
  const selectedConnection = selectedConnectionId
    ? connections.find((c) => c.id === selectedConnectionId)
    : !allowsMultiple
      ? connections[0]
      : undefined;

  const tabs = getSettingsTabs(extension.id);
  const showTabSidebar = !showList && tabs.length >= 2;
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "conexao");

  useEffect(() => {
    const nextTabs = getSettingsTabs(extension.id);
    setActiveTabId((prev) => {
      const ids = new Set(nextTabs.map((t) => t.id));
      return ids.has(prev) ? prev : nextTabs[0]?.id ?? "conexao";
    });
  }, [extension.id]);

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
      status: partial.status ?? existing?.status,
      createdAt: existing?.createdAt,
    };
    onConnectionChange(next);
  };

  const handleConnectionNameChange = (name: string) => {
    if (!selectedConnection) return;
    handleConnectionChange({
      id: selectedConnection.id,
      extensionId: selectedConnection.extensionId,
      name,
    });
  };

  const isIFoodMultiRoot = extension.id === "ifood" && allowsMultiple;
  const [rootSection, setRootSection] = useState<"connections" | "settings">(
    "connections"
  );

  useEffect(() => {
    setRootSection("connections");
  }, [extension.id]);

  // Breadcrumb: Extensões › [Nome extensão] › [Nome conexão]?
  const breadcrumbItems: { label: string; onClick?: () => void }[] = [
    { label: "Extensões", onClick: onBack },
    { label: extension.name, onClick: allowsMultiple && selectedConnectionId ? onBackToList : undefined },
  ];
  if (allowsMultiple && selectedConnection) {
    breadcrumbItems.push({ label: selectedConnection.name });
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Topbar com breadcrumb (PRD §6.2) */}
      <header className="flex shrink-0 items-center gap-2 border-b border-(--talqui-border-weak) bg-(--talqui-bg-base) px-6 py-3 min-h-[56px]">
        <nav aria-label="Navegação" className="flex flex-wrap items-center gap-2 text-sm">
          {breadcrumbItems.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-(--talqui-text-weak)" aria-hidden>
                  ›
                </span>
              )}
              {item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="font-semibold text-(--talqui-text-primary) hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 rounded"
                >
                  {item.label}
                </button>
              ) : (
                <span className="font-semibold text-(--talqui-text-strong)">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar de abas — mesmo padrão do ContentSubSidebar (Talqui AI) */}
        {showTabSidebar && (
          <nav
            className="flex w-[252px] shrink-0 flex-col gap-1 self-stretch overflow-auto border-r border-(--talqui-border-weak) bg-(--talqui-bg-base) px-[18px] py-4"
            aria-label="Navegação Conteúdo"
          >
            {tabs.map((item) => {
              const isActive = activeTabId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTabId(item.id);
                    const el = document.getElementById(item.id);
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex min-h-[44px] w-full cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg) px-3 py-3 text-left text-sm font-semibold leading-5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-(--talqui-bg-weaker) text-(--talqui-text-primary)"
                      : "text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker)"
                  } ${item.description ? "h-auto" : "h-10"}`}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-(--talqui-text-primary)"
                      aria-hidden
                    />
                  )}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate">{item.label}</span>
                    {item.description && (
                      <span className="text-xs font-normal text-(--talqui-text-weak)">
                        {item.description}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Área de conteúdo — scroll interno, max 720px (PRD §6.4) */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {showList ? (
            isIFoodMultiRoot ? (
              <div className="flex min-h-0 flex-1 overflow-hidden">
                <nav
                  className="flex w-[252px] shrink-0 flex-col gap-1 self-stretch overflow-auto border-r border-(--talqui-border-weak) bg-(--talqui-bg-base) px-[18px] py-4"
                  aria-label="Configurações do iFood"
                >
                  {[
                    { id: "connections", label: "Conexões" },
                    { id: "settings", label: "Configurações" },
                  ].map((item) => {
                    const isActive =
                      rootSection === (item.id as "connections" | "settings");
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setRootSection(item.id as "connections" | "settings")
                        }
                        aria-current={isActive ? "page" : undefined}
                        className={`relative flex min-h-[44px] w-full cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg) px-3 py-3 text-left text-sm font-semibold leading-5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 ${
                          isActive
                            ? "bg-(--talqui-bg-weaker) text-(--talqui-text-primary)"
                            : "text-(--talqui-text-medium) hover:bg-(--talqui-bg-weaker)"
                        }`}
                      >
                        {isActive && (
                          <span
                            className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-(--talqui-text-primary)"
                            aria-hidden
                          />
                        )}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
                <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-10 py-8">
                  <div className="mx-auto w-full max-w-[var(--talqui-main-max-w)]">
                    {rootSection === "connections" ? (
                      <ConnectionListContent
                        extension={extension}
                        connections={connections}
                        onSelectConnection={onSelectConnection}
                        onAddConnection={onAddConnection}
                        onUninstall={onUninstall}
                      />
                    ) : (
                      <IFoodGlobalSettingsContent extension={extension} />
                    )}
                  </div>
                </main>
              </div>
            ) : (
              <div className="flex flex-1 flex-col overflow-auto">
                <div className="mx-auto w-full max-w-[720px] px-6 py-8">
                  <ConnectionListContent
                    extension={extension}
                    connections={connections}
                    onSelectConnection={onSelectConnection}
                    onAddConnection={onAddConnection}
                    onUninstall={onUninstall}
                  />
                </div>
              </div>
            )
          ) : (
            <>
              <div className="flex min-h-0 flex-1 flex-col overflow-auto">
                <div className="mx-auto w-full max-w-[720px] flex flex-col gap-8 px-6 py-8">
                  <ConfigHeader
                    extension={extension}
                    connection={selectedConnection}
                    mode={allowsMultiple ? "multi" : "single"}
                    showConnectionId={!!allowsMultiple}
                    onConnectionNameChange={
                      allowsMultiple && selectedConnection
                        ? handleConnectionNameChange
                        : undefined
                    }
                    onReconnect={
                      selectedConnection
                        ? () => {
                            /* Lógica de reconexão (OAuth etc.) fica fora do template */
                          }
                        : undefined
                    }
                  />
                  <ConnectionSettingsRouter
                    extension={extension}
                    connection={selectedConnection}
                    onConnectionChange={handleConnectionChange}
                    onUninstall={onUninstall}
                    registerSaveHandler={(fn) => {
                      saveHandlerRef.current = fn;
                    }}
                    hideContentHeader
                    activeTabId={activeTabId}
                  />
                </div>
              </div>
              <SaveBar
                isMulti={!!allowsMultiple}
                onBackToList={allowsMultiple ? onBackToList : undefined}
                onSave={() => saveHandlerRef.current?.()}
                saving={false}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
