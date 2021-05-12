// babel.config.js

module.exports = function (api) {
  api.cache(true);
  
  const presets = [ "@babel/preset-env", "@babel/preset-react" ];
  const plugins = ["inline-react-svg", "@babel/plugin-proposal-class-properties"];

  return {
    presets,
    plugins
  };
}