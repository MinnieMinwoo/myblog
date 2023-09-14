const webpack = require("webpack");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

/** @type {import('next').NextConfig} */
const config = {
  // …
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mybloguserpostimage153228-myblog.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // Avoid AWS SDK Node.js require issue
    if (isServer && nextRuntime === "nodejs")
      config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ }));
    return config;
  },
  // …
};

module.exports = withBundleAnalyzer(config);
