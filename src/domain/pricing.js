import { PLATFORM_FEE_PERCENT } from './constants/fees';

export function calculatePlatformFee(totalPrice) {
  return totalPrice * (PLATFORM_FEE_PERCENT / 100);
}

export function calculateGuidePayout(totalPrice) {
  return totalPrice - calculatePlatformFee(totalPrice);
}
