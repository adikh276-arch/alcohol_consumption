// Resolves the correct API base URL for both direct and proxied deployments.
// When hosted at /alcohol_consumption/, fetch('/api/...') hits the platform proxy.
// Using window.location.pathname prefix ensures calls reach the container's Express.
const getApiBase = (): string => {
  const base = import.meta.env.BASE_URL || '/';
  // Strip trailing slash, so we can append /api/...
  return base.replace(/\/$/, '');
};

export const apiBase = getApiBase();
export const apiFetch = (path: string, init?: RequestInit) =>
  fetch(`${apiBase}${path}`, init);
