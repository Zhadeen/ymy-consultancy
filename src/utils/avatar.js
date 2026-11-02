export const AVATAR_PLACEHOLDER = '/images/avatar-placeholder.svg';

// Older chat and application documents may still store a stock photo URL from
// before the placeholder was self-hosted, so never render those.
export function avatarSrc(photo) {
  return !photo || photo.includes('images.unsplash.com') ? AVATAR_PLACEHOLDER : photo;
}
