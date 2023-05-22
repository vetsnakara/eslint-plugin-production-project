const path = require("path");
const { isPathRelative } = require("../helpers");
const { realpath } = require("fs");

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const alias = context.options?.[0]?.alias ?? "";

    return {
      ImportDeclaration(node) {
        const filePath = context.getFilename();
        const value = node.source.value;

        const importPath = alias ? value.replace(`${alias}/`, "") : value;

        if (shouldBeRelative(filePath, importPath)) {
          context.report({
            node,
            message:
              "В рамках одного слайса все пути должны быть относительными",
            fix: (fixer) => {
              const normalizedFilePath = getNormalizedFilePath(filePath) // entities/Article/Article.tsx
                .split("/")
                .slice(0, -1) // remove file name
                .join("/");

              let relativePath = path
                .relative(normalizedFilePath, `/${importPath}`)
                .split("\\")
                .join("/");

              if (!relativePath.startsWith(".")) {
                relativePath = `./${relativePath}`;
              }

              return fixer.replaceText(node.source, relativePath);
            },
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

function getNormalizedFilePath(filePath) {
  const normalizedFilePath = path.toNamespacedPath(filePath);
  return normalizedFilePath.split("src")[1].split("\\").join("/");
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
