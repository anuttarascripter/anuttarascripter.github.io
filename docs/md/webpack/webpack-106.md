<p style="text-align: right">2022-02-01</p>

## DefinePlugin

https://webpack.kr/plugins/define-plugin/

DefinePlugin을 사용하면 컴파일 타임에 구성할 수 있는 전역 상수를 만들 수 있습니다.

### Basic Usage

DefinePlugin에 전달된 각 키는 .로 결합 된 개별 또는 다중 식별자입니다.

- 값이 문자열이면 이는 코드 조각으로 사용됩니다.
- 값이 문자열이 아닌 경우 문자열화 됩니다(함수를 포함해서).
- 값이 객체라면 모든 키가 동일한 방식으로 정의됩니다.
- 키에 typeof 접두사를 붙이면 typeof 호출에 대해서만 정의됩니다.
- 값은 코드에 인라인 되어 중복 조건을 제거하기 위한 최소화 단계를 거치게 됩니다.

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify("5fa3b9"),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: "1+1",
      "typeof window": JSON.stringify("object"),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
```

## DevServer

https://webpack.js.org/configuration/dev-server/

### Installation

```bash
npm install --save-dev webpack-dev-server
```

### Usage via CLI

```bash
$ npx webpack serve
$ npx webpack serve --open
$ npx webpack serve --config dev.config.js
```

### webpack.config.js

```js
module.exports = {
  //...
  devServer: {
    open: true,
    client: {
      overlay: true,
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: "/views/landing.html" },
        { from: /^\/subpage/, to: "/views/subpage.html" },
        { from: /./, to: "/views/404.html" },
      ],
    },
    port: 8080,
  },
};
```

## StylelintWebpackPlugin

https://webpack.js.org/plugins/stylelint-webpack-plugin/

### Installation

```bash
$ npm i -D stylelint stylelint-webpack-plugin stylelint-config-standard stylelint-scss
```

### Basic Usage

#### .stylelintrc

```json
{
  "extends": "stylelint-config-standard"
}
```

#### webpack.config.js

```js
const StylelintPlugin = require("stylelint-webpack-plugin");

module.exports = {
  // ...
  plugins: [new StylelintPlugin()],
  // ...
};
```

## Browserslist

https://github.com/browserslist/browserslist

The config to share target browsers and Node.js versions between different front-end tools.

### Config File

All tools will find target browsers automatically, when you add the following to package.json:

```json
{
  "browserslist": ["defaults", "not IE 11", "maintained node versions"]
}
```

Or in .browserslistrc config:

```
defaults
not IE 11
maintained node versions
```

### List

You can specify the browser and Node.js versions by queries (case insensitive):

- defaults \
  Browserslist’s default browsers (> 0.5%, last 2 versions, Firefox ESR, not dead)

- \> 5% \
  browsers versions selected by global usage statistics. >=, < and <= work too.

- last 2 versions \
  the last 2 versions for each browser

- dead \
  browsers without official support or updates for 24 months.

- maintained node versions \
  all Node.js versions, which are still maintained by Node.js Foundation.

### Query Composition

- or \
  \> .5% or last 2 versions \
  \> .5%, last 2 versions

- and \
  \> .5% and last 2 versions

- not \
  not last 2 versions

### Browsers Data Updating

<b>npx browserslist@latest --update-db</b> updates <b>caniuse-lite</b> version in your npm, yarn or pnpm lock file. This update will bring data about new browsers to polyfills tools like Autoprefixer or Babel and reduce already unnecessary polyfills.

```bash
$ npx browserslist@latest --update-db
```

### Debug

Run <b>npx browserslist</b> in project directory to see what browsers was selected by your queries.

```bash
$ npx browserslist
```
