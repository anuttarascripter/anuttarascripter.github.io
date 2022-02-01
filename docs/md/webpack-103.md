<p style="text-align: right">2022-02-02</p>

## style-loader

https://webpack.kr/loaders/style-loader/

Inject CSS into the DOM.

```bash
$ npm install --save-dev style-loader
```

It's recommended to combine style-loader with the css-loader.

### Options

1\. injectType

Allows to setup how styles will be injected into the DOM

- "styleTag" (Default) \
  Automatically injects styles into the DOM using multiple <style></style>. It is default behaviour.

- "singletonStyleTag" \
  Automatically injects styles into the DOM using one <style></style>.

## css-loader

https://webpack.js.org/loaders/css-loader/

### Options

https://github.com/webpack-contrib/css-loader#modules

1\. modules

Allows to enables/disables or setup CSS Modules options \
CSS의 class, id 이름을 자동 재생성하여 모듈에 적용 (여러 CSS에서 이름이 중복되어도 구분가능)

- undefined (Default) \
  enable CSS modules for all files matching /\\.module\\.\w+\$/i.test(filename) and /\\.icss\\.\\w+$/i.test(filename) regexp.

- true \
  enable CSS modules for all files.

- false \
  disables CSS Modules for all files. Using false value increase performance because we avoid parsing CSS Modules features, it will be useful for developers who use vanilla css or use other technologies.

## sass-loader

https://sass-lang.com/ \
https://www.npmjs.com/package/sass-loader

### Installation

```bash
$ npm install sass-loader sass --save-dev
```

### webpack.config.js

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};
```

## babel-loader

https://babeljs.io/ \
https://webpack.js.org/loaders/babel-loader/ \
https://www.npmjs.com/package/babel-loader

### Installation

```bash
$ npm install -D @babel/core @babel/preset-env babel-loader
$ npm install -D @babel/cli @babel/core @babel/preset-env babel-loader
```

### Usage

#### webpack.config.js

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

#### with babel.config.js

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: "babel-loader" },
      },
    ],
  },
};
```

```js
// babel.config.js
module.exports = {
  presets: ["@babel/preset-env"],
};
```

### Presets

https://babeljs.io/docs/en/presets/

Babel presets can act as sharable set of Babel plugins and/or config options.

#### Official Presets

- @babel/preset-env for compiling ES2015+ syntax
- @babel/preset-typescript for TypeScript
- @babel/preset-react for React
- @babel/preset-flow for Flow

#### Preset Ordering

Preset ordering is reversed (last to first).

```js
module.exports = {
  presets: ["a", "b", "c"],
};
```

Will run in the following order: c, b, then a.

This was mostly for ensuring backwards compatibility, since most users listed "es2015" before "stage-0".

https://babeljs.io/docs/en/babel-preset-env \
https://babeljs.io/docs/en/babel-preset-react

### Polyfill

```bash
$ npm install -D @babel/polyfill
```

```js
import "@babel/polyfill";
```

https://tech.kakao.com/2020/12/01/frontend-growth-02/ \
https://jeonghwan-kim.github.io/series/2019/12/22/frontend-dev-env-babel.html \
https://ahnheejong.name/articles/frontend-birds-eye-view-babel/ \
https://devowen.com/293 \
https://medium.com/@nipuna/configuring-a-react-app-using-webpack-and-babel-64412d823bc7
