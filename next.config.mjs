const repoNameFromActions = process.env.GITHUB_REPOSITORY?.split("/")?.[1] ?? "";
const defaultBasePath = process.env.GITHUB_ACTIONS === "true" && repoNameFromActions
  ? `/${repoNameFromActions}`
  : "";
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? defaultBasePath;
const normalizedBasePath = configuredBasePath && configuredBasePath !== "/"
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "export",
  images: {
    unoptimized: true
  },
  experimental: {
    typedRoutes: true
  }
};

if (normalizedBasePath) {
  nextConfig.basePath = normalizedBasePath;
  nextConfig.assetPrefix = `${normalizedBasePath}/`;
}

export default nextConfig;
