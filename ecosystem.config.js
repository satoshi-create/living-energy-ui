const path = require("path");

module.exports = {
  apps: [
    {
      name: "living-energy-ui",
      cwd: __dirname,
      script: path.resolve(__dirname, "node_modules/next/dist/bin/next"),
      args: "dev",
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
    },
  ],
};
