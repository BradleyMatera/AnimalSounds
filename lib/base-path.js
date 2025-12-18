const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const normalizedBasePath =
  configuredBasePath && configuredBasePath !== "/"
    ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
    : "";

function getRuntimeBasePath() {
  // Prefer client-visible runtime hints first
  if (typeof globalThis !== "undefined") {
    const nextRouterBase = globalThis.__next_router__?.basePath;
    if (nextRouterBase) return nextRouterBase;

    const nextDataBase = globalThis.__NEXT_DATA__?.basePath || globalThis.__NEXT_DATA__?.assetPrefix;
    if (nextDataBase) return nextDataBase;
  }

  return normalizedBasePath;
}

export const basePath = normalizedBasePath;

export function withBasePath(path = "") {
  const resolvedBasePath = getRuntimeBasePath();

  if (!resolvedBasePath) {
    return path;
  }

  if (!path) {
    return resolvedBasePath;
  }

  return `${resolvedBasePath}${path.startsWith("/") ? path : `/${path}`}`;
}
