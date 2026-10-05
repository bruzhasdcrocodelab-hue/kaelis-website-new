module.exports = () => ({
  postcssPlugin: "strip-output-bom",
  OnceExit(root) {
    if (root.source) root.source.input.hasBOM = false;
  },
});

module.exports.postcss = true;
