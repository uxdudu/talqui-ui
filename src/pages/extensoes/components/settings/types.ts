import type { Connection, Extension } from "../../data";

export interface ConnectionSettingsContentProps {
  extension: Extension;
  /** Conexão atual sendo editada. Undefined = nova conexão. */
  connection: Connection | undefined;
  onConnectionChange: (connection: Partial<Connection> & { id: string; extensionId: string }) => void;
  onUninstall?: (extensionId: string) => void;
}
