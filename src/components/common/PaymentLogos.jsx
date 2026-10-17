// Official iyzico footer logo band ("iyzico ile Öde", Mastercard, Visa,
// American Express, Troy), required by iyzico's merchant website criteria.
// Source: iyzico-logo-pack/footer_iyzico_ile_ode/Colored. The brand colours need
// a light background, so the band sits on a white panel in the dark footer.
export default function PaymentLogos({ className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-lg bg-white px-3 py-2 max-w-full ${className}`}>
      <img
        src="/payment-logos/iyzico-logo-band-colored.svg"
        alt="Pay with iyzico — Mastercard, Visa, American Express and Troy accepted"
        width="429"
        height="32"
        className="h-6 sm:h-7 w-auto max-w-full"
      />
    </span>
  );
}
