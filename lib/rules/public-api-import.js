const micromatch = require("micromatch");
const { isPathRelative } = require("../helpers");

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Allow absolute imports only from public api",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
          testFilesPatterns: {
            type: "array",
          },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const { alias = "", testFilesPatterns = [] } = context.options[0] || {};

    const availableLayers = {
      entities: "entities",
      features: "features",
      widgets: "widgets",
      pages: "pages",
    };

    return {
      ImportDeclaration(node) {
        const value = node.source.value;

        const importPath = alias ? value.replace(`${alias}/`, "") : value;

        if (isPathRelative(importPath)) return;

        const segments = importPath.split("/");
        const isImportNotFromPublicApi = segments.length > 2;

        const layer = segments[0];
        if (!availableLayers[layer]) return;

        const isTestingPublicApi =
          segments.length < 4 && segments[2] === "testing";

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node,
            message:
              "Абсолютный импорт разрешен только из Public API (index.ts)",
          });
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename();

          const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
            micromatch.isMatch(currentFilePath, pattern)
          );

          if (!isCurrentFileTesting) {
            context.report({
              node,
              message: "Импорт тестовых данных в данный файл запрещен",
            });
          }
        }
      },
    };
  },
};
