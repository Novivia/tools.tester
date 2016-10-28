module.exports = {
  plugins: [
    require.resolve("babel-plugin-add-module-exports"),
    require.resolve("babel-plugin-transform-decorators-legacy"),
  ],
  presets: [
    require.resolve("babel-preset-latest"),
    require.resolve("babel-preset-react"),
    require.resolve("babel-preset-stage-0"),
  ],
};
