const ts = () => new Date().toISOString().slice(11, 19);
export const log = {
  info: (m: string, ...r: unknown[]) => console.log(`[${ts()}] ${m}`, ...r),
  step: (m: string, ...r: unknown[]) => console.log(`[${ts()}] › ${m}`, ...r),
  ok: (m: string, ...r: unknown[]) => console.log(`[${ts()}] ✓ ${m}`, ...r),
  warn: (m: string, ...r: unknown[]) => console.warn(`[${ts()}] ⚠ ${m}`, ...r),
  error: (m: string, ...r: unknown[]) => console.error(`[${ts()}] ✗ ${m}`, ...r),
};
