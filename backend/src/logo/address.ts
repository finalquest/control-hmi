import type { BitAddress, WordAddress } from "./mapping.js";

const VM_BIT = /^V(\d+)\.([0-7])$/;
const MARKER = /^M(\d+)$/;
const VM_WORD = /^VW(\d+)$/;

const MARKER_FIRST_COIL = 8256;

export function parseBitAddress(addr: BitAddress): number {
  let m = VM_BIT.exec(addr);
  if (m) return Number(m[1]) * 8 + Number(m[2]);
  m = MARKER.exec(addr);
  if (m) return MARKER_FIRST_COIL + (Number(m[1]) - 1);
  throw new Error(`Dirección de bit inválida: ${addr}`);
}

export function parseWordAddress(addr: WordAddress): number {
  const m = VM_WORD.exec(addr);
  if (!m) throw new Error(`Dirección de word inválida: ${addr}`);
  const byteOffset = Number(m[1]);
  if (byteOffset % 2 !== 0) {
    throw new Error(`Word VM debe comenzar en byte par: ${addr}`);
  }
  return byteOffset / 2;
}
