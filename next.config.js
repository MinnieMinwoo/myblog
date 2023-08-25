const webpack = require("webpack");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

/** @type {import('next').NextConfig} */
const config = {
  // …
  webpack: (config, { isServer, nextRuntime }) => {
    // Avoid AWS SDK Node.js require issue
    if (isServer && nextRuntime === "nodejs")
      config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ }));
    return config;
  },
  // …
};

module.exports = withBundleAnalyzer(config);
