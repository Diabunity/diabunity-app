const presets = ['module:metro-react-native-babel-preset'];
const plugins = [];

plugins.push([
  'module-resolver',
  {
    root: ['./src'],
    extensions: ['.js', '.json'],
    alias: {
      '@': './src',
    },
  },
]);

plugins.push(['react-native-reanimated/plugin']);

plugins.push(['transform-html-import-to-string']);

module.exports = {
  presets,
  plugins,
};
