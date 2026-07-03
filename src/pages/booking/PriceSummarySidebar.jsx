import ScrollReveal from '../../components/common/ScrollReveal';

export default function PriceSummarySidebar({
  guide, date, tourType, basePrice, guests, totalPrice,
  error, processing, canConfirm, onConfirm
}) {
  return (
    <aside className="lg:w-96 flex-shrink-0">
      <div className="sticky top-28">
        <ScrollReveal>
          <div className="card-dark p-6 border-gold-200">
            <h3 className="font-heading text-xl font-bold text-cream mb-6">Price Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Guide</span>
                <span className="text-cream">{guide.name}</span>
              </div>
              {date && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Date</span>
                  <span className="text-cream">
                    {(() => {
                      const [year, month, day] = date.split('-').map(Number);
                      const localDateObj = new Date(year, month - 1, day);
                      return localDateObj.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                    })()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted">Tour type</span>
                <span className="text-cream capitalize">{tourType} day</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Base price</span>
                <span className="text-cream">${basePrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Guests</span>
                <span className="text-cream">× {guests}</span>
              </div>
              <div className="h-px bg-dark-600" />
              <div className="flex justify-between">
                <span className="text-cream font-semibold">Total</span>
                <span className="text-gold font-heading text-2xl font-bold">${totalPrice}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-btn px-4 py-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={onConfirm}
              disabled={!canConfirm || processing}
              className="btn-gold w-full !py-4 text-lg flex items-center justify-center gap-2"
              id="confirm-booking-btn"
            >
              {processing ? (
                <div className="w-6 h-6 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              ) : (
                "Send Booking Request"
              )}
            </button>

            <p className="text-muted-dark text-xs text-center mt-4">
              Full refund if cancelled more than 24 hours before the tour
            </p>
          </div>
        </ScrollReveal>
      </div>
    </aside>
  );
}
