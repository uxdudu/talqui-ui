import { useState } from "react";
import {
  FilterBar,
  ExtensionCard,
  ExtensionDetailsModal,
  ExtensionSettingsPage,
} from "./components";
import { PageHeader } from "../../components/layout/PageHeader";
import { Sidebar } from "../../components/layout/Sidebar";
import type { SidebarNavId } from "../../components/layout/Sidebar";
import { EXTENSIONS } from "./data";
import type { Extension, Connection } from "./data";

type ExtensionsViewFilter = "todas" | "instaladas";
type FilterTab = "todos" | "gratis" | "pago";

interface ExtensoesPageProps {
  activeNav?: SidebarNavId;
  onNavTo?: (id: SidebarNavId) => void;
}

export function ExtensoesPage({ activeNav = "extensoes", onNavTo }: ExtensoesPageProps) {
  const [view, setView] = useState<ExtensionsViewFilter>("todas");
  const [tab, setTab] = useState<FilterTab>("todos");
  const [extensions, setExtensions] = useState<Extension[]>(EXTENSIONS);
  const [detailsModalExtension, setDetailsModalExtension] =
    useState<Extension | null>(null);
  const [settingsExtensionId, setSettingsExtensionId] = useState<string | null>(
    null
  );
  const [settingsConnectionId, setSettingsConnectionId] = useState<string | null>(null);
  const [connectionsByExtension, setConnectionsByExtension] = useState<
    Record<string, Connection[]>
  >({});

  const settingsExtension = settingsExtensionId
    ? extensions.find((e) => e.id === settingsExtensionId) ?? null
    : null;

  const settingsConnections = settingsExtension
    ? connectionsByExtension[settingsExtension.id] ?? []
    : [];

  const displayedExtensions =
    view === "instaladas"
      ? extensions.filter((e) => e.enabled)
      : extensions;

  const handleToggle = (id: string, enabled: boolean) => {
    setExtensions((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, enabled, showSettings: enabled } : e
      )
    );
  };

  const handleSettings = (id: string) => {
    const ext = extensions.find((e) => e.id === id);
    setSettingsExtensionId(id);
    if (ext?.allowsMultipleConnections) {
      setSettingsConnectionId(null);
      return;
    }
    const list = connectionsByExtension[id] ?? [];
    if (list.length === 0) {
      const defaultConn: Connection = {
        id: crypto.randomUUID(),
        extensionId: id,
        name: ext?.name ?? id,
        config: {},
        connected: false,
      };
      setConnectionsByExtension((prev) => ({ ...prev, [id]: [defaultConn] }));
      setSettingsConnectionId(defaultConn.id);
    } else {
      setSettingsConnectionId(list[0].id);
    }
  };

  const handleBackFromSettings = () => {
    setSettingsExtensionId(null);
    setSettingsConnectionId(null);
  };

  const handleBackToList = () => {
    setSettingsConnectionId(null);
  };

  const handleSelectConnection = (connection: Connection) => {
    setSettingsConnectionId(connection.id);
  };

  const handleAddConnection = () => {
    if (!settingsExtension) return;
    const newConn: Connection = {
      id: crypto.randomUUID(),
      extensionId: settingsExtension.id,
      name: `Nova conexão ${(settingsConnections.length + 1)}`,
      config: {},
      connected: false,
    };
    setConnectionsByExtension((prev) => ({
      ...prev,
      [settingsExtension.id]: [...(prev[settingsExtension.id] ?? []), newConn],
    }));
    setSettingsConnectionId(newConn.id);
  };

  const handleConnectionChange = (connection: Connection) => {
    setConnectionsByExtension((prev) => {
      const list = prev[connection.extensionId] ?? [];
      const idx = list.findIndex((c) => c.id === connection.id);
      const next =
        idx >= 0
          ? list.map((c) => (c.id === connection.id ? connection : c))
          : [...list, connection];
      return { ...prev, [connection.extensionId]: next };
    });
  };

  const handleDetails = (id: string) => {
    const ext = extensions.find((e) => e.id === id);
    if (!ext) return;
    setDetailsModalExtension(ext);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalExtension(null);
  };

  const handleInstall = (id: string) => {
    setExtensions((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, installed: true, enabled: true, showSettings: true } : e
      )
    );
    setDetailsModalExtension(null);
  };

  const handleUninstall = (id: string) => {
    setExtensions((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, installed: false, enabled: false, showSettings: false } : e
      )
    );
    setDetailsModalExtension(null);
    setSettingsExtensionId(null);
    setSettingsConnectionId(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--talqui-bg-weaker) p-1">
      <Sidebar activeNav={activeNav} onNavClick={onNavTo} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-(--talqui-radius-xl)">
        {!settingsExtension && <PageHeader title="Extensões" />}
        <div className="flex min-h-0 flex-1 w-full bg-white overflow-hidden">
          <div
            className={
              settingsExtension
                ? "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                : "flex w-full min-w-0 flex-1 flex-col gap-8 overflow-auto px-10 py-8"
            }
          >
            {settingsExtension ? (
              <ExtensionSettingsPage
                extension={settingsExtension}
                connections={settingsConnections}
                selectedConnectionId={settingsConnectionId}
                onBack={handleBackFromSettings}
                onBackToList={handleBackToList}
                onSelectConnection={handleSelectConnection}
                onAddConnection={handleAddConnection}
                onConnectionChange={handleConnectionChange}
                onUninstall={handleUninstall}
              />
            ) : (
              <div className="mx-auto w-full max-w-[var(--talqui-main-max-w)] flex flex-col gap-8">
                <FilterBar
                  view={view}
                  onViewChange={setView}
                  tab={tab}
                  onTabChange={setTab}
                />
                <div className="grid w-full max-w-none gap-4 grid-cols-3 grid-rows-3">
                  {displayedExtensions.map((ext) => (
                    <ExtensionCard
                      key={ext.id}
                      extension={ext}
                      connectionCount={connectionsByExtension[ext.id]?.length ?? 0}
                      onToggle={handleToggle}
                      onSettings={handleSettings}
                      onDetails={handleDetails}
                      onInstall={handleInstall}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {detailsModalExtension && (
        <ExtensionDetailsModal
          extension={detailsModalExtension}
          onClose={handleCloseDetailsModal}
          onInstall={handleInstall}
        />
      )}
    </div>
  );
}
