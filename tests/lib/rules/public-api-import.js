/**
 * @fileoverview Allow absolute imports only from public api
 * @author Konstantin Arakantsev
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-import"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});

const aliasOptions = [
  {
    alias: "@",
  },
];

ruleTester.run("public-api-import", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [
        {
          alias: "@",
          testFilesPatterns: ["**/*.test.ts", "**/StoreDecorator.tsx"],
        },
      ],
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [
        {
          alias: "@",
          testFilesPatterns: ["**/*.test.ts", "**/StoreDecorator.tsx"],
        },
      ],
    },
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
      errors: [
        {
          message: "Абсолютный импорт разрешен только из Public API (index.ts)",
        },
      ],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
      errors: [
        {
          message: "Абсолютный импорт разрешен только из Public API (index.ts)",
        },
      ],
      options: [
        {
          alias: "@",
          testFilesPatterns: ["**/*.test.ts", "**/StoreDecorator.tsx"],
        },
      ],
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\forbidden.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [
        {
          message: "Импорт тестовых данных в данный файл запрещен",
        },
      ],
      options: [
        {
          alias: "@",
          testFilesPatterns: ["**/*.test.ts", "**/StoreDecorator.tsx"],
        },
      ],
    },
  ],
});
