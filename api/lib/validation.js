// The default origin used when a request has no Origin header (matches the value already
// hardcoded identically in create-checkout-session.js, create-subscription-session.js, and
// create-tourist-subscription-session.js prior to this consolidation).
export function resolveOrigin(req) {
  return req.headers.origin || 'https://www.ymycons.com';
}
