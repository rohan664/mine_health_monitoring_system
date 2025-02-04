module.exports = {
  reactStrictMode: false,
  webpack: (config: any) => {
    config.infrastructureLogging = { level: "warn" }; // Hide warnings
    return config;
  },
};
