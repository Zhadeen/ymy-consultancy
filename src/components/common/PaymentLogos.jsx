// Official iyzico footer logo band ("iyzico ile Öde", Mastercard, Visa,
// American Express, Troy), required by iyzico's merchant website criteria.
// Source: iyzico-logo-pack/footer_iyzico_ile_ode/White — the white variant suits
// the dark footer. Swap for the Colored variant on light backgrounds.
export default function PaymentLogos({ className = '' }) {
  return (
    <img
      src="/payment-logos/iyzico-logo-band-white.svg"
      alt="Pay with iyzico — Mastercard, Visa, American Express and Troy accepted"
      width="456"
      height="32"
      className={`h-6 sm:h-7 w-auto max-w-full ${className}`}
    />
  );
}
