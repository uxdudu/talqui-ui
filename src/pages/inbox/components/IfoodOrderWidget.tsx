/**
 * Tipos e dados de pedido iFood para o widget na sidebar do inbox.
 * Os dados reais virão da API; aqui definimos o contrato e mock para UI.
 */

import { getExtensionLogo, getLocalExtensionLogoUrl } from "../../../lib/brand-icons";
import { getExtensionLogoUrl } from "../../../lib/brandfetch";
import type { Extension } from "../../extensoes/data";
import { Icons } from "../../../components/icons";

export interface IfoodOrderItem {
  name: string;
  quantity: number;
  unit: string;
  unitPriceCents: number;
}

export interface IfoodOrderStatusStep {
  label: string;
  timestamp: string; // ex: "02/03/26 às 11:19"
}

export interface IfoodOrderValues {
  subtotalCents: number;
  serviceFeeCents: number;
  deliveryFeeCents: number;
  discountCents: number;
  totalCents: number;
  paymentStatus: string; // ex: "Pago online"
  paymentMethod: string; // ex: "Pagamento pelo app do banco"
}

export interface IfoodOrder {
  orderId: string; // ex: "3208"
  internalNumber: string;
  locator: string;
  customerName: string;
  documentRedacted: string;
  deliveryAddress: string;
  values: IfoodOrderValues;
  items: IfoodOrderItem[];
  statusSteps: IfoodOrderStatusStep[];
  /** Texto de status atual do pedido (ex.: "Saiu para entrega"). */
  statusLabel?: string;
}

function formatBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/** Mock de pedido para exibição no widget (conforme layout de referência). */
export function getMockIfoodOrder(): IfoodOrder {
  return {
    orderId: "3208",
    internalNumber: "665844601",
    locator: "14106336",
    customerName: "EDUARDO",
    documentRedacted: "undefined: REDACTED",
    deliveryAddress: "R. Geremia Lunardelli, 120 - Jardim Peri Peri, São Paulo/SP - CEP: 05537100",
    values: {
      subtotalCents: 18200,
      serviceFeeCents: 0,
      deliveryFeeCents: 990,
      discountCents: 910,
      totalCents: 17290,
      paymentStatus: "Pago online",
      paymentMethod: "Pagamento pelo app do banco",
    },
    items: [
      { name: "Beneflora Vet 14 Gr Avert", quantity: 1, unit: "un.", unitPriceCents: 9100 },
      { name: "Beneflora Vet 14 Gr Avert", quantity: 1, unit: "un.", unitPriceCents: 9100 },
    ],
    statusSteps: [
      { label: "Pedido realizado", timestamp: "02/03/26 às 11:19" },
      { label: "A caminho do cliente", timestamp: "02/03/26 às 11:49" },
    ],
    statusLabel: "Saiu para entrega",
  };
}

/** Cor de destaque iFood (timeline e botão). */
const IFOOD_ACCENT = "#ea1d2c";

export interface IfoodOrderWidgetProps {
  order: IfoodOrder;
  extension?: Extension;
}

export function IfoodOrderWidget({ order, extension }: IfoodOrderWidgetProps) {
  const v = order.values;

  const Logo = extension ? getExtensionLogo(extension.id) : null;
  const localLogoUrl = extension ? getLocalExtensionLogoUrl(extension.id) : null;
  const logoUrl = extension ? (localLogoUrl ?? getExtensionLogoUrl(extension)) : null;
  const showLogo = Boolean(Logo || logoUrl);

  return (
    <div className="flex flex-col gap-3">
      {/* Status atual do pedido (somente visual, sem ação) */}
      {order.statusLabel && (
        <div className="w-full rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-(--talqui-bg-weaker) px-3 py-2.5 text-center text-sm font-semibold text-(--talqui-text-strong)">
          {order.statusLabel}
        </div>
      )}

      {/* Card: Detalhes do pedido */}
      <div className="relative rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white p-3">
        {showLogo && (
          <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
            {Logo ? (
              <Logo className="h-8 w-8 text-[#ea1d2c]" />
            ) : (
              <img src={logoUrl!} alt="" className="h-8 w-8 object-contain" />
            )}
          </div>
        )}
        <h3 className="pr-10 text-base font-bold text-(--talqui-text-strong)">
          Pedido #{order.orderId}
        </h3>
        <dl className="mt-2 space-y-1 text-sm">
          <div className="flex flex-wrap gap-x-1">
            <dt className="text-(--talqui-text-weak)">Número interno:</dt>
            <dd className="text-(--talqui-text-primary)">{order.internalNumber}</dd>
          </div>
          <div className="flex flex-wrap gap-x-1">
            <dt className="text-(--talqui-text-weak)">Localizador:</dt>
            <dd className="text-(--talqui-text-primary)">{order.locator}</dd>
          </div>
          <div className="flex flex-wrap gap-x-1">
            <dt className="text-(--talqui-text-weak)">Nome do cliente:</dt>
            <dd className="text-(--talqui-text-strong)">{order.customerName}</dd>
          </div>
          <div className="flex flex-wrap gap-x-1">
            <dt className="text-(--talqui-text-weak)">Documento do cliente:</dt>
            <dd className="text-(--talqui-text-medium)">{order.documentRedacted}</dd>
          </div>
          <div>
            <dt className="text-(--talqui-text-weak)">Endereço de entrega:</dt>
            <dd className="mt-0.5 text-(--talqui-text-primary)">{order.deliveryAddress}</dd>
          </div>
        </dl>
      </div>

      {/* Card: Resumo de valores */}
      <div className="rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white p-3">
        <h4 className="text-sm font-bold text-(--talqui-text-strong)">Resumo de valores</h4>
        <ul className="mt-2 space-y-1 text-sm">
          <li className="flex justify-between">
            <span className="text-(--talqui-text-medium)">Subtotal</span>
            <span className="text-(--talqui-text-primary)">{formatBRL(v.subtotalCents)}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-(--talqui-text-medium)">Taxa de serviço</span>
            <span className="text-(--talqui-text-primary)">{formatBRL(v.serviceFeeCents)}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-(--talqui-text-medium)">Taxa de entrega</span>
            <span className="text-(--talqui-text-primary)">{formatBRL(v.deliveryFeeCents)}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-(--talqui-text-medium)">Desconto</span>
            <span className="text-(--talqui-text-primary)">-{formatBRL(v.discountCents)}</span>
          </li>
        </ul>
        <div className="mt-2 border-t border-dashed border-(--talqui-border-weak) pt-2">
          <div className="flex justify-end">
            <span className="text-base font-bold text-(--talqui-text-strong)">
              Total do pedido {formatBRL(v.totalCents)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-xs text-(--talqui-text-weak)">
            <span>{v.paymentStatus}</span>
            <span className="flex items-center gap-1">
              <Icons.Tag size={14} />
              {v.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      {/* Card: Itens no pedido */}
      <div className="rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white p-3">
        <h4 className="text-sm font-bold text-(--talqui-text-strong)">
          {order.items.length} {order.items.length === 1 ? "Item no pedido" : "Itens no pedido"}
        </h4>
        <ul className="mt-2 space-y-3">
          {order.items.map((item, i) => (
            <li key={i}>
              <p className="text-sm font-medium text-(--talqui-text-strong)">{item.name}</p>
              <p className="mt-0.5 text-xs text-(--talqui-text-weak)">
                {item.quantity} {item.unit}.{" "}
                <span className="font-semibold text-(--talqui-text-strong)">
                  {formatBRL(item.unitPriceCents)}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Card: Status do pedido (timeline) */}
      <div className="rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white p-3">
        <h4 className="text-sm font-bold text-(--talqui-text-strong)">Status do pedido</h4>
        <div className="relative mt-3 pl-3">
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
            style={{ backgroundColor: IFOOD_ACCENT }}
          />
          {order.statusSteps.map((step, i) => (
            <div key={i} className="relative flex flex-col pb-4 last:pb-0">
              <span
                className="absolute -left-3 top-0.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: IFOOD_ACCENT }}
              />
              <span className="text-sm font-medium text-(--talqui-text-strong)">{step.label}</span>
              <span className="text-xs text-(--talqui-text-weak)">{step.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
