import { useEffect, useRef, useState } from "react";
import type { Connection, Extension } from "../../data";
import { getConnectionStatus } from "../../data";
import { getExtensionLogo, getLocalExtensionLogoUrl } from "../../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../../lib/brandfetch";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";
import { StatusBadge } from "./StatusBadge";

interface ConfigHeaderProps {
  extension: Extension;
  /** No Single é a única conexão; no Multi é a conexão selecionada. */
  connection: Connection | undefined;
  /** Single: título = extensão, subtítulo = descrição. Multi: título = conexão, subtítulo = info da conexão. */
  mode: "single" | "multi";
  /** Mostrar ID copiável (opcional em Single, recomendado em Multi). */
  showConnectionId?: boolean;
  onReconnect?: () => void;
  /** Permite renomear a conexão diretamente no cabeçalho (apenas modo multi). */
  onConnectionNameChange?: (name: string) => void;
}

function ConnectionIcon({
  extension,
  connection,
}: {
  extension: Extension;
  connection: Connection | undefined;
}) {
  const logoUrl = (connection?.config?.iconUrl as string) ?? null;
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
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

export function ConfigHeader({
  extension,
  connection,
  mode,
  showConnectionId = false,
  onReconnect,
  onConnectionNameChange,
}: ConfigHeaderProps) {
  const status = connection
    ? getConnectionStatus(connection)
    : ("disconnected" as const);
  const showReconnect = status !== "connected" && onReconnect;

  const title =
    mode === "single"
      ? extension.name
      : connection?.name ?? "Nova conexão";
  const subtitle =
    mode === "single"
      ? extension.description
      : connection
        ? (connection.config?.subtitle as string) ?? extension.description
        : extension.description;

  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(title);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const canEditConnectionName =
    mode === "multi" && Boolean(connection) && Boolean(onConnectionNameChange);

  useEffect(() => {
    setDraftName(title);
  }, [title]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleCommitName = () => {
    if (!canEditConnectionName) {
      setIsEditingName(false);
      return;
    }
    const next = draftName.trim() || title;
    setDraftName(next);
    setIsEditingName(false);
    onConnectionNameChange?.(next);
  };

  const handleKeyDownName: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCommitName();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setDraftName(title);
      setIsEditingName(false);
    }
  };

  const handleCopyId = () => {
    if (!connection?.id) return;
    void navigator.clipboard.writeText(connection.id);
  };

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-4">
        <ConnectionIcon extension={extension} connection={connection} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 gap-y-1">
            {canEditConnectionName ? (
              <h1 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
                {isEditingName ? (
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    onBlur={handleCommitName}
                    onKeyDown={handleKeyDownName}
                    aria-label="Nome da conexão"
                    className="min-h-[32px] rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-2 text-lg font-bold leading-7 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong)"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="cursor-pointer bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 rounded-(--talqui-radius-sm)"
                    title="Renomear conexão"
                  >
                    {title}
                  </button>
                )}
              </h1>
            ) : (
              <h1 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
                {title}
              </h1>
            )}
            {connection && (
              <StatusBadge connection={connection} className="shrink-0" />
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
              {subtitle}
            </p>
          )}
          {showConnectionId && connection?.id && (
            <div className="mt-2 flex items-center gap-2">
              <code className="rounded-(--talqui-radius-sm) bg-(--talqui-bg-weaker) px-2 py-1 text-xs font-mono text-(--talqui-text-medium)">
                {connection.id.slice(0, 8)}…
              </code>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-xs font-semibold text-(--talqui-text-primary) hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 rounded"
                aria-label="Copiar ID da conexão"
              >
                Copiar ID
              </button>
            </div>
          )}
        </div>
        {showReconnect && (
          <Button
            size="medium"
            variant="secondary"
            onClick={onReconnect}
            className="shrink-0"
          >
            <Icons.Refresh size={18} className="mr-1.5 shrink-0" />
            Reconectar
          </Button>
        )}
      </div>
    </header>
  );
}
