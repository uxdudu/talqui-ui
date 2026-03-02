export type ExtensionPrice =
  | { type: "free" }
  | { type: "paid"; value: string }
  | { type: "trial"; minDays: number };

export interface Extension {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  /** Domínio para buscar logo no Brandfetch (ex.: "instagram.com"). Requer VITE_BRANDFETCH_CLIENT_ID. */
  brandfetchDomain?: string;
  price: ExtensionPrice;
  enabled: boolean;
  showSettings: boolean;
  /** Se true, o usuário pode criar várias conexões (multi connection). Se false, há uma única conexão por extensão (single connection). */
  allowsMultipleConnections?: boolean;
  /** Se false, a extensão aparece como "não instalada" (botão Instalar, sem tag Instalado). Omitido = true. */
  installed?: boolean;
}

/** Uma instância de conexão de uma extensão (ex.: uma conta Instagram, uma loja iFood). */
export interface Connection {
  id: string;
  extensionId: string;
  name: string;
  /** Dados específicos da conexão; cada extensão interpreta como quiser. */
  config: Record<string, unknown>;
  /** @deprecated Preferir status. Quando true equivale a status "connected". */
  connected?: boolean;
  /** Status da conexão (PRD §10). Se ausente, deriva de connected. */
  status?: ConnectionStatus;
  createdAt?: string;
}

/** Status de conexão (PRD §10). */
export type ConnectionStatus = "connected" | "disconnected" | "error" | "warning";

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  connected: "Conexão estável",
  disconnected: "Desconectado",
  error: "Erro de conexão",
  warning: "Atenção necessária",
};

/** Retorna o status efetivo da conexão (usa status ou deriva de connected). */
export function getConnectionStatus(c: Connection): ConnectionStatus {
  if (c.status) return c.status;
  return c.connected ? "connected" : "disconnected";
}

/** Label do status para exibição. */
export function getConnectionStatusLabel(status: ConnectionStatus): string {
  return STATUS_LABELS[status];
}

/**
 * Extensões multi connection: o usuário vê a lista de conexões e, ao escolher uma,
 * entra na tela de configuração (mesma estrutura visual da extensão single connection).
 * As demais são single connection: uma única conexão por extensão, acesso direto à configuração.
 */
export const MULTI_CONNECTION_EXTENSION_IDS = new Set([
  "ifood",
  "whatsapp-api",
  "sgp",
  "ixc",
  "instagram",
  "lugares",
  "calendly",
  "mercadolivre",
  "messenger",
  "telegram",
  "whatsapp-oficial",
  "whatsapp-business",
  "leaf-provedor",
  "wordpress",
  "chatbot",
  "hubsoft",
  "webchat",
  "ntfy",
]);

/** Retorna true se a extensão é multi connection. */
export function isMultiConnectionExtension(extensionId: string): boolean {
  return MULTI_CONNECTION_EXTENSION_IDS.has(extensionId);
}

// Placeholder logos (Figma assets) para extensões sem ícone SVG no brand-icons
const LOGO_SOCIAL =
  "https://www.figma.com/api/mcp/asset/d0f89440-f84d-46da-9e33-a71d6e6463c2";
const LOGO_APP =
  "https://www.figma.com/api/mcp/asset/e0bcbe19-fe9c-4d3b-ae6e-3b4a5ffc397b";

/** Extensões com enabled/showSettings true (iFood, Mercado Livre, Hotmart, e uma paga fictícia) estão assim apenas para testar a UI. */

export const EXTENSIONS: Extension[] = [
  {
    id: "talqui-ai",
    name: "Talqui AI",
    description:
      "Inteligência artificial integrada ao painel para respostas automáticas, resumos e atendimento mais rápido.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
  },
  {
    id: "whatsapp-api",
    name: "WhatsApp API",
    description:
      "Integração com a API do WhatsApp para enviar e receber mensagens diretamente pelo painel de atendimento da Talqui.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "sgp",
    name: "SGP",
    description:
      "Conecte o SGP ao painel e centralize o atendimento com histórico e gestão de chamados em um só lugar.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "ixc",
    name: "IXC",
    description:
      "Sincronize clientes e ordens de serviço do IXC com o painel para agilizar atendimento e abertura de chamados.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "ifood",
    name: "iFood",
    description:
      "Receba e responda pedidos e mensagens do iFood no painel de atendimento, com notificações em tempo real.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "ifood.com.br",
    price: { type: "trial", minDays: 7 },
    enabled: true,
    showSettings: true,
    allowsMultipleConnections: true,
  },
  {
    id: "lugares",
    name: "Lugares",
    description:
      "Integre informações de lugares e endereços ao atendimento para consultas e envio de localização.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "calendly",
    name: "Calendly",
    description:
      "Agende reuniões e compromissos pelo Calendly direto no fluxo de atendimento, sem sair do painel.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "calendly.com",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    description:
      "Sincronize contatos e negócios do Pipedrive com o painel para um atendimento alinhado ao funil de vendas.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "pipedrive.com",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
  },
  {
    id: "pipefy",
    name: "Pipefy",
    description:
      "Conecte fluxos do Pipefy ao atendimento e automatize tarefas, etapas e notificações entre sistemas.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "pipefy.com",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
  },
  {
    id: "mercadolivre",
    name: "Mercado Livre",
    description:
      "Atenda perguntas e vendas do Mercado Livre pelo painel, com histórico de pedidos e mensagens centralizado.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "mercadolivre.com.br",
    price: { type: "trial", minDays: 14 },
    enabled: true,
    showSettings: true,
    allowsMultipleConnections: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    description:
      "A Talqui permite que você responda e envie mensagens diretas do Instagram diretamente pelo painel de atendimento.",
    logoUrl: LOGO_SOCIAL,
    brandfetchDomain: "instagram.com",
    price: { type: "free" },
    enabled: true,
    showSettings: true,
    allowsMultipleConnections: true,
  },
  {
    id: "messenger",
    name: "Messenger",
    description:
      "Responda a mensagens de suas páginas do Facebook (Messenger) diretamente através do nosso painel de atendimento.",
    logoUrl: LOGO_SOCIAL,
    brandfetchDomain: "messenger.com",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "telegram",
    name: "Telegram",
    description:
      "Receba e responda mensagens do Telegram no painel da Talqui, com suporte a grupos e canais.",
    logoUrl: LOGO_SOCIAL,
    brandfetchDomain: "telegram.org",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "whatsapp-oficial",
    name: "WhatsApp API Oficial",
    description:
      "Integração com a API Oficial do WhatsApp para enviar e receber mensagens com número verificado.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "whatsapp.com",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    description:
      "Conecte sua conta WhatsApp Business ao painel e gerencie conversas, catálogo e respostas rápidas.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "whatsapp.com",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "hotmart",
    name: "Hotmart",
    description:
      "Integre vendas e assinaturas da Hotmart ao atendimento para suporte pós-venda e consulta de compradores.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "hotmart.com.br",
    price: { type: "trial", minDays: 7 },
    enabled: true,
    showSettings: true,
  },
  {
    id: "leaf-provedor",
    name: "Leaf Provedor",
    description:
      "Sincronize dados do Leaf Provedor com o painel para atendimento e abertura de chamados integrados.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "wordpress",
    name: "Wordpress",
    description:
      "Integre formulários e contatos do WordPress ao painel para centralizar leads e atendimento.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "wordpress.org",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "chatbot",
    name: "Chatbot",
    description:
      "Configure e gerencie fluxos de chatbot no painel para respostas automáticas e qualificação de leads.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "hubsoft",
    name: "Hubsoft",
    description:
      "Conecte o Hubsoft ao painel para sincronizar clientes, contratos e atendimento em um só lugar.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "webchat",
    name: "WebChat",
    description:
      "Widget de chat para seu site que envia conversas direto para o painel de atendimento da Talqui.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "ntfy",
    name: "Ntfy (Notificações)",
    description:
      "Receba notificações e alertas no painel ou por push, integradas ao fluxo de atendimento e chamados.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
    allowsMultipleConnections: true,
  },
  {
    id: "jira",
    name: "Jira",
    description:
      "Crie e atualize issues do Jira a partir do atendimento e mantenha suporte e desenvolvimento alinhados.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "atlassian.com",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
  },
  {
    id: "slack",
    name: "Slack",
    description:
      "Receba avisos de atendimento no Slack e responda ou encaminhe direto do seu workspace.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "slack.com",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
  },
  {
    id: "hubspot",
    name: "Hubspot",
    description:
      "Sincronize contatos e atividades do HubSpot com o painel para um atendimento orientado a CRM.",
    logoUrl: LOGO_APP,
    brandfetchDomain: "hubspot.com",
    price: { type: "free" },
    enabled: false,
    showSettings: false,
  },
  {
    id: "dify",
    name: "Dify",
    description:
      "Conecte assistentes e fluxos de IA do Dify ao atendimento para respostas automáticas e triagem.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
  },
  {
    id: "resumos",
    name: "Resumos",
    description:
      "Gere resumos de conversas e atendimentos no painel para documentação e acompanhamento rápido.",
    logoUrl: LOGO_APP,
    price: { type: "free" },
    enabled: false,
    showSettings: false,
  },
];
