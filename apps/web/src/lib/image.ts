/**
 * Transforms Cloudinary URLs to our proxy path (/image/upload/...)
 * so images are served through our domain instead of directly from Cloudinary.
 *
 * Example:
 * "https://res.cloudinary.com/dqaqtqigh/image/upload/v1234/avatar.png"
 * -> "/image/upload/v1234/avatar.png"
 */
export function getProxiedImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // If already relative / proxied, return as-is
  if (trimmed.startsWith("/image/upload/")) {
    return trimmed;
  }

  // If it's a data URL or blob URL, return as-is
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // Match Cloudinary host pattern with or without cloud name
  // e.g. https://res.cloudinary.com/<cloud_name>/image/upload/...
  const cloudinaryRegex = /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(.+)$/i;
  const match = trimmed.match(cloudinaryRegex);
  if (match?.[1]) {
    return `/image/upload/${match[1]}`;
  }

  return trimmed;
}
