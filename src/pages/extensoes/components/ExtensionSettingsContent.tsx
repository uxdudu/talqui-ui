import type { ComponentType } from "react";
import { useState } from "react";
import type { Extension } from "../data";
import {
  PERMISSIONS_BY_CATEGORY,
  ABOUT_INTEGRATION_SUMMARY,
} from "../details-modal-content";
import { getExtensionLogo } from "../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../lib/brandfetch";
import { Icons } from "../../../components/icons";
import { Button } from "../../../components/ui/Button";

function PermissionColumn({
  title,
  icon: Icon,
  category,
  items,
  permissions,
  onPermissionChange,
}: {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  category: string;
  items: readonly string[];
  permissions: Record<string, boolean>;
  onPermissionChange: (key: string, enabled: boolean) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-(--talqui-text-medium)" />
        <span className="text-xs font-semibold text-(--talqui-text-medium)">
          {title}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((label) => {
          const key = `${category}-${label}`;
          const enabled = permissions[key] ?? true;
          return (
            <li key={label}>
              <button
                type="button"
                role="checkbox"
                aria-checked={enabled}
                onClick={() => onPermissionChange(key, !enabled)}
                className="flex w-full cursor-pointer items-center gap-2 text-left hover:opacity-90"
              >
                <span
                  className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border border-(--talqui-border-normal) transition-colors hover:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong)"
                  style={{
                    backgroundColor: enabled
                      ? "var(--talqui-text-primary)"
                      : "transparent",
                  }}
                >
                  {enabled && <span className="text-[8px] text-white">✓</span>}
                </span>
                <span className="text-xs font-semibold text-(--talqui-text-strong)">
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface ExtensionSettingsContentProps {
  extension: Extension;
  onUninstall?: (id: string) => void;
}

export function ExtensionSettingsContent({
  extension,
  onUninstall,
}: ExtensionSettingsContentProps) {
  const [connected, setConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    (Object.entries(PERMISSIONS_BY_CATEGORY) as [keyof typeof PERMISSIONS_BY_CATEGORY, readonly string[]][]).forEach(
      ([category, labels]) => {
        labels.forEach((label) => {
          initial[`${category}-${label}`] = true;
        });
      }
    );
    return initial;
  });

  const handlePermissionChange = (key: string, enabled: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: enabled }));
  };

  return (
    <div className="flex max-w-[740px] flex-col gap-6">
      {/* SubHeader — padrão das páginas de procedimentos: título + descrição */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold leading-7 text-(--talqui-text-strong)">
              Configurações da extensão
            </h2>
            <p className="mt-1 text-sm leading-5 text-(--talqui-text-medium)">
              Conexão, parâmetros e permissões desta extensão.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-(--talqui-radius-sm) px-2 py-1 text-sm font-semibold leading-5 text-(--talqui-text-medium)">
            Salvo automaticamente
          </span>
        </div>
      </div>

      {/* Card — Figma: border, rounded-xl, white bg */}
      <div className="overflow-hidden rounded-(--talqui-radius-xl) border border-(--talqui-border-normal) bg-(--talqui-bg-base)">
        {/* Card content */}
        <div className="flex flex-col gap-6 p-6">
          {/* Extension header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-(--talqui-border-weak) p-2">
              {(() => {
                const Logo = getExtensionLogo(extension.id);
                if (Logo) {
                  return (
                    <Logo
                      className="h-5 w-5 shrink-0 text-(--talqui-text-strong)"
                      aria-hidden
                    />
                  );
                }
                return (
                  <img
                    src={getExtensionLogoUrl(extension)}
                    alt={`Logo da extensão ${extension.name}`}
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
                {ABOUT_INTEGRATION_SUMMARY}
              </p>
            </div>
          </div>

          {/* Conexão */}
          <section id="conexao" className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Conexão
            </h4>
            <p className="text-sm font-normal leading-5 text-(--talqui-text-weak)">
              Conecte a conta ou canal que esta extensão usará para enviar e receber mensagens.
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
                    {connected ? "Conta conectada" : "Nenhuma conta conectada"}
                  </p>
                  <p className="text-xs text-(--talqui-text-weak)">
                    {connected
                      ? "Sincronização ativa com o canal"
                      : "Conecte para ativar a extensão"}
                  </p>
                </div>
              </div>
              <Button
                size="large"
                variant="secondary"
                onClick={() => setConnected(!connected)}
              >
                {connected ? "Desconectar" : "Conectar"}
              </Button>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px w-full shrink-0 bg-(--talqui-border-normal)" />

          {/* Parâmetros da conexão */}
          <section id="parametros" className="flex flex-col gap-2">
            <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
              Parâmetros da conexão
            </h4>
            <p className="text-sm font-normal leading-5 text-(--talqui-text-weak)">
              Ajuste URL do webhook, chave de API e outras opções desta extensão.
            </p>
            <div className="mt-3 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="settings-webhook-url"
                  className="text-sm font-semibold leading-5 text-(--talqui-text-strong)"
                >
                  URL do webhook
                </label>
                <input
                  id="settings-webhook-url"
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://exemplo.com/webhook"
                  className="min-h-[36px] rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-2 py-2 text-sm leading-5 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong)"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="settings-api-key"
                  className="text-sm font-semibold leading-5 text-(--talqui-text-strong)"
                >
                  Chave de API
                </label>
                <input
                  id="settings-api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Opcional — para APIs que exigem autenticação"
                  className="min-h-[36px] rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-2 py-2 text-sm leading-5 text-(--talqui-text-strong) placeholder:text-(--talqui-text-weak) focus:border-(--talqui-border-strong) focus:outline-none focus:ring-1 focus:ring-(--talqui-border-strong)"
                />
              </div>
              <div className="flex justify-end">
                <Button size="large" variant="primary">
                  Salvar parâmetros
                </Button>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px w-full shrink-0 bg-(--talqui-border-normal)" />

          {/* Permissões */}
          <section id="permissoes" className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold leading-6 tracking-[-0.32px] text-(--talqui-text-strong)">
                Permissões
              </h4>
              <button
                type="button"
                className="text-sm font-semibold text-(--talqui-text-primary) hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 rounded-(--talqui-radius-sm) px-1 py-0.5"
              >
                O que são?
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <PermissionColumn
                title="Mensagens"
                icon={Icons.ChatBubble}
                category="mensagens"
                items={PERMISSIONS_BY_CATEGORY.mensagens}
                permissions={permissions}
                onPermissionChange={handlePermissionChange}
              />
              <PermissionColumn
                title="Contatos"
                icon={Icons.AddressBook}
                category="contatos"
                items={PERMISSIONS_BY_CATEGORY.contatos}
                permissions={permissions}
                onPermissionChange={handlePermissionChange}
              />
              <PermissionColumn
                title="Site"
                icon={Icons.Globe}
                category="site"
                items={PERMISSIONS_BY_CATEGORY.site}
                permissions={permissions}
                onPermissionChange={handlePermissionChange}
              />
            </div>
          </section>
        </div>

        {/* Card Footer — Figma: "Precisa de Ajuda?" link */}
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

      {/* Actions row: Ver vídeo + Desinstalar */}
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
