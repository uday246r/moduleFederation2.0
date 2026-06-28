module.exports = {
  plugins: [
    require('postcss-prefix-selector')({
      prefix: '#inventory-mf-scope',
      transform(prefix, selector, prefixedSelector, filePath, rule) {
        if (selector === 'body' || selector === 'html' || selector === ':root') {
          return prefix;
        }
        return prefixedSelector;
      }
    })
  ]
};
