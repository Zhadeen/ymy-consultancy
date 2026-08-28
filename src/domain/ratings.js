// Ratings are derived from the `reviews` collection at read time rather than
// denormalised onto the guide document. The old approach had the reviewer
// write the guide's rating back onto the guide doc, which the security rules
// (correctly) reject — a user may not write another user's guide document — so
// submissions failed and ratings never updated. Computing on read needs no
// privileged write and can never drift out of sync with the reviews.

// Average rating + count for one set of reviews. Returns rating: null when
// there are no reviews yet, so callers can fall back to a "new guide" default
// instead of showing zero stars.
export function computeRating(reviews) {
  const reviewCount = reviews.length;
  if (reviewCount === 0) return { rating: null, reviewCount: 0 };
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return { rating: Number((sum / reviewCount).toFixed(1)), reviewCount };
}

// Group guide-directed reviews by guideId and compute each guide's rating.
// Reviews aimed at a visitor (guide→visitor) carry no guideId and are skipped.
export function buildGuideRatingMap(reviews) {
  const byGuide = {};
  for (const r of reviews) {
    const gid = r.guideId;
    if (!gid) continue;
    if (!byGuide[gid]) byGuide[gid] = [];
    byGuide[gid].push(r);
  }
  const map = {};
  for (const gid of Object.keys(byGuide)) {
    map[gid] = computeRating(byGuide[gid]);
  }
  return map;
}

// Merge computed ratings into a list of guides. A guide with no reviews yet
// keeps its stored rating (the "5.0" set at approval) so new guides don't show
// as zero-star.
export function applyRatings(guides, ratingMap) {
  return guides.map((g) => {
    const computed = ratingMap[g.id || g.uid];
    if (!computed || computed.reviewCount === 0) return g;
    return { ...g, rating: computed.rating, reviewCount: computed.reviewCount };
  });
}
