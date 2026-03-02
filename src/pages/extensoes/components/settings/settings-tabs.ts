/** Aba da sidebar de configuração (PRD §6.3, §12). */
export interface SettingsTabItem {
  id: string;
  label: string;
  description: string;
}

const GENERIC_TABS: SettingsTabItem[] = [
  { id: "conexao", label: "Conexão", description: "Status e reconexão" },
  { id: "parametros", label: "Parâmetros", description: "Webhook, API e opções" },
  { id: "permissoes", label: "Permissões", description: "Escopo de acesso" },
  { id: "status", label: "Status", description: "Status da API e incidentes" },
];

/** iFood: mesmo padrão visual do single (sidebar de abas) ao abrir uma conexão. */
const IFOOD_TABS: SettingsTabItem[] = [
  { id: "loja", label: "Loja", description: "Informações da loja" },
  { id: "automacoes", label: "Automações", description: "Respostas e notificações" },
  { id: "status", label: "Status", description: "Status da API e incidentes" },
];

const STATUS_TAB: SettingsTabItem = {
  id: "status",
  label: "Status",
  description: "Status da API e incidentes",
};

/** Extensões com uma única aba (sem sidebar de abas). */
const SINGLE_TAB_EXTENSIONS = new Set([
  "instagram",
  "lugares",
  "calendly",
]);

/**
 * Retorna as abas de configuração para a extensão.
 * Sidebar de abas só aparece quando há 2+ abas (PRD §13).
 * Multi (ex.: iFood) usa 2+ abas para manter o mesmo padrão visual do single (ex.: WhatsApp API).
 */
export function getSettingsTabs(extensionId: string): SettingsTabItem[] {
  if (extensionId === "ifood") return IFOOD_TABS;
  if (SINGLE_TAB_EXTENSIONS.has(extensionId)) {
    return [
      { id: "geral", label: "Geral", description: "Configurações da conexão" },
      STATUS_TAB,
    ];
  }
  return GENERIC_TABS;
}
