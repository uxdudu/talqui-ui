import type { ComponentType } from "react";
import type { Extension } from "../data";
import {
  PERMISSIONS_BY_CATEGORY,
  ABOUT_INTEGRATION_TEXT,
} from "../details-modal-content";
import { getExtensionLogoUrl } from "../../../lib/brandfetch";
import { Icons } from "../../../components/icons";
import { Button } from "../../../components/ui/Button";

function PermissionColumn({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  items: readonly string[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-[var(--talqui-text-medium)]" />
        <span className="text-sm font-semibold text-[var(--talqui-text-medium)]">
          {title}
        </span>
      </div>
      <ul className="flex flex-col gap-3">
        {items.map((label) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[var(--talqui-text-primary)] text-[10px] text-white">
              ✓
            </span>
            <span className="text-sm font-semibold text-[var(--talqui-text-strong)]">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type ExtensionDetailsVariant = "modal" | "settings";

interface ExtensionDetailsContentProps {
  extension: Extension;
  variant: ExtensionDetailsVariant;
  onInstall?: (id: string) => void;
  onUninstall?: (id: string) => void;
}

export function ExtensionDetailsContent({
  extension,
  variant,
  onInstall,
  onUninstall,
}: ExtensionDetailsContentProps) {
  const priceLabel =
    extension.price.type === "free"
      ? "Grátis"
      : extension.price.type === "trial"
        ? `Mín. ${extension.price.minDays} dias`
        : `R$ ${extension.price.value} /mês`;
  const isInstalled = variant === "settings";

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-[var(--talqui-border-weak)] bg-white shadow-lg">
      {/* Header com gradiente */}
      <div className="relative flex flex-col gap-6 border-b border-[var(--talqui-bg-weaker)] px-8 py-8">
        <div
          className="absolute inset-0 rounded-t-3xl opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(0,122,255,0.25) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex items-start justify-between gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <h2
                id="extension-details-title"
                className="text-3xl font-semibold tracking-tight text-[var(--talqui-text-strong)]"
              >
                {extension.name}
              </h2>
              <span className="rounded-full border border-[var(--talqui-border-weak)] bg-white px-2 py-1 text-xs font-bold text-[var(--talqui-text-strong)]">
                {priceLabel}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-(--talqui-radius-sm) border border-[var(--talqui-border-normal)] bg-white p-0.5">
              {[
                "Site do Autor",
                "Contato do autor",
                "Termos de uso",
                "Política de Privacidade",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-(--talqui-radius-sm-inset-2) px-2 py-1.5 text-xs font-semibold text-[var(--talqui-text-primary)] hover:bg-[var(--talqui-bg-weaker)]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-[#25D366] shadow-sm">
              <img
                src={getExtensionLogoUrl(extension)}
                alt=""
                className="h-7 w-7 object-contain"
              />
            </div>
            <Icons.Exchange size={24} className="text-[var(--talqui-text-weak)]" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-[var(--talqui-text-primary)] shadow-sm text-white">
              <Icons.Extension size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Permissões */}
      <div className="flex flex-col gap-2 px-6 pt-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-[var(--talqui-text-strong)]">
            Permissões
          </h3>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg py-1 text-xs font-semibold text-[var(--talqui-text-primary)] hover:underline"
          >
            <span className="flex h-4 w-4 items-center justify-center">?</span>
            O que são permissões?
          </button>
        </div>
        <div className="h-px w-full bg-[var(--talqui-border-weak)]" />
        <div className="flex gap-4 py-4">
          <PermissionColumn
            title="Mensagens"
            icon={Icons.ChatBubble}
            items={PERMISSIONS_BY_CATEGORY.mensagens}
          />
          <PermissionColumn
            title="Contatos"
            icon={Icons.AddressBook}
            items={PERMISSIONS_BY_CATEGORY.contatos}
          />
          <PermissionColumn
            title="Site"
            icon={Icons.Globe}
            items={PERMISSIONS_BY_CATEGORY.site}
          />
        </div>
      </div>

      {/* Sobre essa integração */}
      <div className="flex flex-col gap-2 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[var(--talqui-text-strong)]">
            Sobre essa integração
          </h3>
          <Icons.ChevronDown size={20} className="text-[var(--talqui-text-weak)]" />
        </div>
        <div className="whitespace-pre-wrap text-base leading-6 text-[var(--talqui-text-medium)]">
          {ABOUT_INTEGRATION_TEXT}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[var(--talqui-border-weak)] px-6 py-6">
        <button
          type="button"
          className="text-base font-semibold text-[var(--talqui-text-primary)] hover:underline"
        >
          Precisa de ajuda?
        </button>
        <div className="flex items-center gap-4">
          <Button
            size="large"
            variant="secondary"
          >
            Ver vídeo
          </Button>
          {isInstalled ? (
            <Button
              size="large"
              variant="danger"
              onClick={() => onUninstall?.(extension.id)}
            >
              Desinstalar
            </Button>
          ) : (
            <Button
              size="large"
              variant="primary"
              onClick={() => onInstall?.(extension.id)}
            >
              Instalar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
