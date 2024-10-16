const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  // ... other configurations
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['javascript', 'json', 'html', 'xml', 'picoBlaze'], // Add the languages you need
    }),
  ],
};
