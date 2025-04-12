const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable optimization and domain restrictions
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.moduleIds = "named";
    }
    return config;
  },
});
