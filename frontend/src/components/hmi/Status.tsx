import type { BackendStatus } from "shared";

export interface StatusProps {
  status: BackendStatus;
  connected: boolean;
  detail?: string;
}

const label: Record<BackendStatus, string> = {
  simulating: "Simulación",
  connecting: "Conectando",
  online: "En línea",
  offline: "Desconectado",
  error: "Error",
};

function dotClass(status: BackendStatus, connected: boolean): string {
  if (!connected) return "status-dot status-dot--off";
  if (status === "simulating") return "status-dot status-dot--sim";
  if (status === "online") return "status-dot status-dot--online";
  return "status-dot status-dot--off";
}

export function Status({ status, connected, detail }: StatusProps) {
  return (
    <div className="navbar__conn" title={detail}>
      <span className={dotClass(status, connected)} />
      <span>{connected ? label[status] : "Desconectado"}</span>
    </div>
  );
}
