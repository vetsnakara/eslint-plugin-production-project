# eslint-plugin-production-project-plugin

plugin for production project

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-production-project-plugin`:

```sh
npm install eslint-plugin-production-project-plugin --save-dev
```

## Usage

Add `production-project-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "production-project-plugin"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "production-project-plugin/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


