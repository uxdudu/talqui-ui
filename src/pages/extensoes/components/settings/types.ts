import type { Connection, Extension } from "../../data";

export interface ConnectionSettingsContentProps {
  extension: Extension;
  /** Conexão atual sendo editada. Undefined = nova conexão. */
  connection: Connection | undefined;
  onConnectionChange: (connection: Partial<Connection> & { id: string; extensionId: string }) => void;
  onUninstall?: (extensionId: string) => void;
  /** Quando informado, o conteúdo deve registrar sua função de salvar para o SaveBar da página. */
  registerSaveHandler?: (fn: () => void) => void;
  /** Quando true, não renderiza o cabeçalho/cartão com logo no conteúdo (a página já exibe ConfigHeader). Mantém o mesmo layout de extensão single. */
  hideContentHeader?: boolean;
  /** Aba ativa da sidebar (para conteúdo que varia por aba, ex.: iFood Loja vs Automações). */
  activeTabId?: string;
}
