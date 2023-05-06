/**
 * @fileoverview feature sliced relative path checker
 * @author Konstantin Arakantsev
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/fsd-path-checker"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
});

ruleTester.run("fsd-path-checker", rule, {
  valid: [
    {
      filename:
        "C:\\k.arakantsev\\projects\\production-project\\src\\features\\AddComment\\ui\\AddCommentForm\\AddCommentForm.tsx",
      code: "import { getAddCommentFormText } from '../../model/selectors/addCommentSelectors';",
      errors: [],
    },
  ],

  invalid: [
    {
      filename:
        "C:\\k.arakantsev\\projects\\production-project\\src\\features\\AddComment\\ui\\AddCommentForm\\AddCommentForm.tsx",
      code: "import { getAddCommentFormText } from 'features/AddComment/model/selectors/addCommentSelectors';",
      errors: [
        {
          message: "В рамках одного слайса все пути должны быть относительными",
        },
      ],
    },
    {
      filename:
        "C:\\k.arakantsev\\projects\\production-project\\src\\features\\AddComment\\ui\\AddCommentForm\\AddCommentForm.tsx",
      code: "import { getAddCommentFormText } from '@/features/AddComment/model/selectors/addCommentSelectors';",
      errors: [
        {
          message: "В рамках одного слайса все пути должны быть относительными",
        },
      ],
      options: [{ alias: "@" }],
    },
  ],
});
