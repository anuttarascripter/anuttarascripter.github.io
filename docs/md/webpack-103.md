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
