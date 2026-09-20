import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const envBasePath = process.env.BASE_PATH || '';
const computedBasePath = envBasePath || (isGithubActions && repo && !process.env.CUSTOM_DOMAIN ? `/${repo}` : '');

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: computedBasePath || undefined,
  assetPrefix: computedBasePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
