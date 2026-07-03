// Mirrors src/domain/constants/fees.js. Duplicated rather than imported across the api/ <-> src/
// boundary: src/domain uses Vite-style extensionless imports, which plain Node ESM (the Vercel
// function runtime) can't resolve — confirmed by spiking `node src/domain/pricing.js` directly,
// which throws ERR_MODULE_NOT_FOUND. Keep both files in sync if the platform fee changes.
export const PLATFORM_FEE_PERCENT = 15;

export function calculatePlatformFee(totalPrice) {
  return totalPrice * (PLATFORM_FEE_PERCENT / 100);
}
