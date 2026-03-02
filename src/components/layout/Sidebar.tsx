import FIGMA_ASSETS from "../../lib/figma-assets";
import { Icons } from "../icons";

const navItems = [
  { id: "mensagens" as const, label: "Mensagens", Icon: Icons.Chat },
  { id: "envio" as const, label: "Envio", Icon: Icons.Send },
  { id: "agenda" as const, label: "Agenda", Icon: Icons.Calendar },
  { id: "relatorios" as const, label: "Relatórios", Icon: Icons.Chart },
  { id: "extensoes" as const, label: "Extensões", Icon: Icons.Extension },
  { id: "procedimentos" as const, label: "Talqui AI", Icon: Icons.Ai },
] as const;

export type SidebarNavId = (typeof navItems)[number]["id"];

interface SidebarProps {
  activeNav?: SidebarNavId;
  /** Quando não informado, Talqui AI (procedimentos) fica ativo para compatibilidade. */
  /** Chamado ao clicar em um item de navegação (quando informado, permite alternar de página). */
  onNavClick?: (id: SidebarNavId) => void;
}

/**
 * Sidebar padrão da aplicação Talqui.
 * Deve ser usada da mesma forma em todas as páginas (lista, configurações, etc.).
 * Não criar variantes ou sidebars por página — este é o único layout de navegação.
 */
export function Sidebar({ activeNav = "procedimentos", onNavClick }: SidebarProps) {
  return (
    <aside className="flex h-full w-20 shrink-0 flex-col items-center justify-between overflow-hidden bg-(--talqui-bg-weaker) py-4">
      <div className="flex shrink-0 w-full flex-col items-center gap-4">
        <div className="flex h-16 w-full items-center justify-center px-4">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-(--talqui-bg-weaker)">
            <img
              src={FIGMA_ASSETS.avatar}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
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
