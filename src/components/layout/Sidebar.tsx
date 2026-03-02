import { useState } from "react";
import FIGMA_ASSETS from "../../lib/figma-assets";
import { Icons } from "../icons";

const navItems = [
  { id: "mensagens" as const, label: "Chat", Icon: Icons.Chat },
  { id: "relatorios" as const, label: "Estatísticas", Icon: Icons.Chart },
  { id: "extensoes" as const, label: "Extensões", Icon: Icons.Extension },
  { id: "procedimentos" as const, label: "Talqui AI", Icon: Icons.Ai },
] as const;

export type SidebarNavId = (typeof navItems)[number]["id"];

type TenantIconKind = "chat" | "doc";

export interface SidebarTenant {
  id: string;
  name: string;
  subtitle: string;
  icon: TenantIconKind;
}

const DEFAULT_TENANTS: SidebarTenant[] = [
  {
    id: "digital71",
    name: "DIGITAL71",
    subtitle: "d71.com.br",
    icon: "chat",
  },
  {
    id: "talqui-comercial",
    name: "Talqui - Comercial",
    subtitle: "talqui.chat",
    icon: "chat",
  },
  {
    id: "contec-provedores",
    name: "CONTEC PROVEDORES",
    subtitle: "gmail.com",
    icon: "doc",
  },
  {
    id: "talqui-tester",
    name: "Talqui - Tester",
    subtitle: "talqui.chat",
    icon: "doc",
  },
];

interface SidebarProps {
  activeNav?: SidebarNavId;
  /** Quando não informado, Talqui AI (procedimentos) fica ativo para compatibilidade. */
  /** Chamado ao clicar em um item de navegação (quando informado, permite alternar de página). */
  onNavClick?: (id: SidebarNavId) => void;
  /** Lista de tenants para troca de empresa. Se omitido, usa uma lista mock. */
  tenants?: SidebarTenant[];
  /** ID do tenant atualmente selecionado. Se omitido, usa o primeiro da lista. */
  currentTenantId?: string;
  /** Chamado ao selecionar um tenant diferente. */
  onTenantChange?: (tenantId: string) => void;
}

interface TenantSwitcherProps {
  tenant: SidebarTenant | null;
  tenants: SidebarTenant[];
  onChangeTenant?: (tenantId: string) => void;
  onNavClick?: (id: SidebarNavId) => void;
}

function getTenantIcon(kind: TenantIconKind) {
  if (kind === "chat") return Icons.ChatBubble;
  return Icons.Document;
}

function TenantSwitcher({
  tenant,
  tenants,
  onChangeTenant,
  onNavClick,
}: TenantSwitcherProps) {
  const [open, setOpen] = useState(false);

  const CurrentIcon = tenant ? getTenantIcon(tenant.icon) : Icons.ChatBubble;

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        title={tenant ? `Empresa atual: ${tenant.name}` : "Selecionar empresa"}
        aria-label={tenant ? `Empresa atual: ${tenant.name}` : "Selecionar empresa"}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-(--talqui-bg-weaker) ring-2 ring-white shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        <img
          src={FIGMA_ASSETS.avatar}
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="pointer-events-none absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/8">
          <Icons.Exchange size={14} className="opacity-80" />
        </span>
      </button>

      {open && (
        <div
          className="fixed left-24 top-4 z-40 w-80 rounded-(--talqui-radius-xl) border border-(--talqui-border-weak) bg-white/90 p-3 text-left shadow-xl backdrop-blur-xl"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex items-center justify-between gap-2 px-1 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--talqui-bg-weaker)">
                <CurrentIcon size={18} className="opacity-90" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-5 text-(--talqui-text-strong)">
                  {tenant?.name ?? "Selecione a empresa"}
                </span>
                {tenant?.subtitle && (
                  <span className="text-xs leading-4 text-(--talqui-text-medium)">
                    {tenant.subtitle}
                  </span>
                )}
              </div>
            </div>
            <Icons.ChevronUp size={18} className="opacity-60" />
          </div>

          <div className="mt-1 border-t border-(--talqui-border-weak)/60 pt-2">
            <p className="px-1 pb-1 text-xs font-medium uppercase tracking-wide text-(--talqui-text-medium)">
              Trocar de Empresa
            </p>
            <div className="flex flex-col gap-1">
              {tenants.map((t) => {
                const Icon = getTenantIcon(t.icon);
                const isActive = tenant?.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onChangeTenant?.(t.id)}
                    className={`flex w-full items-center gap-3 rounded-(--talqui-radius-lg) px-2.5 py-1.5 text-left text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 motion-reduce:transition-none ${
                      isActive
                        ? "bg-black/4 text-(--talqui-text-primary)"
                        : "hover:bg-black/2 text-(--talqui-text-medium)"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--talqui-bg-weaker)">
                      <Icon
                        size={18}
                        className={isActive ? "opacity-100" : "opacity-80"}
                      />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm leading-5">{t.name}</span>
                      <span className="text-xs leading-4 text-(--talqui-text-weak)">
                        {t.subtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 border-t border-(--talqui-border-weak)/60 pt-2">
            <p className="px-1 pb-1 text-xs font-medium uppercase tracking-wide text-(--talqui-text-medium)">
              Navegação
            </p>
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavClick?.(item.id)}
                  className="flex w-full items-center gap-3 rounded-(--talqui-radius-lg) px-2.5 py-1.5 text-left text-sm text-(--talqui-text-medium) transition-colors duration-200 hover:bg-black/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--talqui-radius-lg) bg-(--talqui-bg-weaker)">
                    <item.Icon size={18} className="opacity-90" />
                  </span>
                  <span className="text-sm leading-5">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 border-t border-(--talqui-border-weak)/60 pt-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-(--talqui-radius-lg) px-2.5 py-1.5 text-left text-sm text-(--talqui-text-medium) transition-colors duration-200 hover:bg-black/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <Icons.User size={18} className="opacity-80" />
              <span>Convidar um operador</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Sidebar padrão da aplicação Talqui.
 * Deve ser usada da mesma forma em todas as páginas (lista, configurações, etc.).
 * Não criar variantes ou sidebars por página — este é o único layout de navegação.
 */
export function Sidebar({
  activeNav = "procedimentos",
  onNavClick,
  tenants,
  currentTenantId,
  onTenantChange,
}: SidebarProps) {
  const resolvedTenants = tenants && tenants.length > 0 ? tenants : DEFAULT_TENANTS;
  const currentTenant =
    resolvedTenants.find((t) => t.id === (currentTenantId ?? resolvedTenants[0]?.id)) ??
    resolvedTenants[0] ??
    null;
  return (
    <aside className="flex h-full w-20 shrink-0 flex-col items-center justify-between overflow-hidden bg-(--talqui-bg-weaker) py-4">
      <div className="flex shrink-0 w-full flex-col items-center gap-4">
        <div className="flex h-16 w-full items-center justify-center px-4">
          <TenantSwitcher
            tenant={currentTenant}
            tenants={resolvedTenants}
            onChangeTenant={onTenantChange}
            onNavClick={onNavClick}
          />
        </div>
        <nav className="flex flex-col gap-2 px-2">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onNavClick?.(item.id)}
                className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-(--talqui-radius-lg) text-(--talqui-text-medium) transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 motion-reduce:transition-none ${
                  isActive
                    ? "bg-black/4 text-(--talqui-text-primary)"
                    : "hover:bg-white/50"
                }`}
              >
                <item.Icon
                  size={20}
                  className={isActive ? "opacity-100" : "opacity-80"}
                />
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-2 px-2">
        <button
          type="button"
          title="Configurações"
          aria-label="Configurações"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-(--talqui-radius-lg) text-(--talqui-text-medium) transition-colors duration-200 hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          <Icons.Settings size={20} className="opacity-70" />
        </button>
        <button
          type="button"
          title="Ajuda"
          aria-label="Ajuda"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-(--talqui-radius-lg) text-(--talqui-text-medium) transition-colors duration-200 hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          <Icons.Help size={20} className="opacity-70" />
        </button>
        <div className="relative mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-(--talqui-bg-weaker) ring-2 ring-white shadow-sm">
          <img
            src={FIGMA_ASSETS.avatar}
            alt="Usuário"
            className="h-full w-full rounded-full object-cover"
          />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-(--talqui-green-500)" />
        </div>
      </div>
    </aside>
  );
}
