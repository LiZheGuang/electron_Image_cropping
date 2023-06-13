module.exports = {
  packagerConfig: {
    icon: './src/assets/icon' 
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.js",
              name: "main_window",
              preload: {
                js: "./src/preload.js",
              },
            },
            {
              html: "./src/pages/gpt.html",
              js: "./src/pages/gpts/gpt.js",
              name: "gpt_window",
              preload: {
                js: "./src/pages/gpts/preload.js",
              },
            },
          ],
        },
      },
    },
  ],
};
