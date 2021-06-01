const path = require("path");
module.exports = {
  outputDir: path.resolve(__dirname, "../api/public"),
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000"
      }
    }
  }
};
