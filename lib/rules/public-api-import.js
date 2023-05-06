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
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const alias = context.options?.[0]?.alias ?? "";

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

        if (isImportNotFromPublicApi) {
          context.report({
            node,
            message:
              "Абсолютный импорт разрешен только из Public API (index.ts)",
          });
        }
      },
    };
  },
};
