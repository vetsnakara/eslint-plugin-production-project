const path = require("path");

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const filePath = context.getFilename();
        const importPath = node.source.value;

        if (shouldBeRelative(filePath, importPath)) {
          context.report({
            node,
            message:
              "В рамках одного слайса все пути должны быть относительными",
          });
        }
      },
    };
  },
};

const layers = {
  shared: "shared",
  entities: "entities",
  features: "features",
  widgets: "widgets",
  pages: "pages",
};

function isPathRelative(path) {
  return path === "." || path.startsWith("./") || path.startsWith("../");
}

function shouldBeRelative(filePath, importPath) {
  if (isPathRelative(importPath)) {
    return false;
  }

  const [importLayer, importSlice] = importPath.split("/"); // [entities, Article]

  if (!importLayer || !importSlice || !layers[importLayer]) {
    return false;
  }

  const normalizedFilePath = path.toNamespacedPath(filePath);
  const [fileLayer, fileSlice] = normalizedFilePath
    .split("src")[1]
    .split("\\")
    .filter(Boolean);

  if (!fileLayer || !fileSlice || !layers[fileLayer]) {
    return false;
  }

  if (importLayer === fileLayer && importSlice === fileSlice) {
    return true;
  }
}
