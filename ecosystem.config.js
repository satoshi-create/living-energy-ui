module.exports = {
  apps: [
    {
      name: "living-energy-ui",
      script: "node_modules/.bin/next",
      args: "dev",
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
    },
  ],
};

