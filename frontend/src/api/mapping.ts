import type { VmMapping } from "shared";

export async function fetchVmMapping(): Promise<VmMapping> {
  const res = await fetch("/api/mapping");
  if (!res.ok) throw new Error(`mapping HTTP ${res.status}`);
  return (await res.json()) as VmMapping;
}
