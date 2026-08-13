/** @type {import('next').NextConfig} */
const nextConfig = {
  // This repository is nested beneath other workspaces. Pin Turbopack to this
  // application so production builds do not traverse an inaccessible parent.
  turbopack: {
    root: process.cwd(),
  }
}

export default nextConfig
