const repoNameFromActions = process.env.GITHUB_REPOSITORY?.split("/")?.[1] ?? "";
const defaultBasePath =
  process.env.GITHUB_ACTIONS === "true" && repoNameFromActions
    ? `/${repoNameFromActions}`
    : "";

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? defaultBasePath;
const normalizedBasePath =
  configuredBasePath && configuredBasePath !== "/"
    ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
    : "";

function getRuntimeBasePath() {
  if (typeof globalThis !== "undefined") {
    const nextBasePath = globalThis.__NEXT_DATA__?.basePath;
    if (nextBasePath) {
      return nextBasePath;
    }
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
