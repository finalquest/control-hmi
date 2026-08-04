import type { VmBitAddress, VmWordAddress } from "./mapping.js";

const VM_BIT = /^V(\d+)\.([0-7])$/;
const VM_WORD = /^VW(\d+)$/;

export function parseVmBit(addr: VmBitAddress): number {
  const m = VM_BIT.exec(addr);
  if (!m) throw new Error(`Dirección VM de bit inválida: ${addr}`);
  const byteOffset = Number(m[1]);
  const bit = Number(m[2]);
  return byteOffset * 8 + bit;
}

export function parseVmWord(addr: VmWordAddress): number {
  const m = VM_WORD.exec(addr);
  if (!m) throw new Error(`Dirección VM de word inválida: ${addr}`);
  const byteOffset = Number(m[1]);
  if (byteOffset % 2 !== 0) {
    throw new Error(`Word VM debe comenzar en byte par: ${addr}`);
  }
  return byteOffset / 2;
}
