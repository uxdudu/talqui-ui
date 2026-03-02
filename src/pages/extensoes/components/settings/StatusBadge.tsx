import {
  getConnectionStatus,
  getConnectionStatusLabel,
  type Connection,
  type ConnectionStatus,
} from "../../data";

interface StatusBadgeProps {
  /** Conexão para derivar status (usa getConnectionStatus). */
  connection?: Connection | null;
  /** Ou status direto quando não há conexão. */
  status?: ConnectionStatus;
  /** Label customizado (sobrescreve o padrão). */
  label?: string;
  className?: string;
}

const statusStyles: Record<
  ConnectionStatus,
  { bg: string; text: string; dot: string }
> = {
  connected: {
    bg: "bg-(--talqui-green-a10)",
    text: "text-(--talqui-text-success)",
    dot: "bg-(--talqui-green-500)",
  },
  disconnected: {
    bg: "bg-(--talqui-bg-weaker)",
    text: "text-(--talqui-text-weak)",
    dot: "bg-current",
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
};

export function StatusBadge({
  connection,
  status: statusProp,
  label: labelProp,
  className = "",
}: StatusBadgeProps) {
  const status: ConnectionStatus =
    statusProp ?? (connection ? getConnectionStatus(connection) : "disconnected");
  const label = labelProp ?? getConnectionStatusLabel(status);
  const styles = statusStyles[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.bg} ${styles.text} ${className}`}
      aria-label={label}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`}
        aria-hidden
      />
      {label}
    </span>
  );
}
