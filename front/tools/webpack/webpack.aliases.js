const { createWebpackAliases } = require('./webpack.helpers');

/**
 * Export Webpack Aliases
 *
 * Tip: Some text editors will show the errors or invalid intellisense reports
 * based on these webpack aliases, make sure to update `tsconfig.json` file also
 * to match the `paths` we using in here for aliases in project.
 */
module.exports = createWebpackAliases({
  '@assets': 'assets',
  '@src': 'src',
  '@scenes': 'src/scenes',
  '@components': 'src/components',
  '@store': 'src/store',
  '@utils': 'src/utils',
  '@config': 'src/config',
});
