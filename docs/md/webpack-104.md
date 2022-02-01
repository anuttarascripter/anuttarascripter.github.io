<p style="text-align: right">2022-02-01</p>

## Optimization

https://webpack.kr/configuration/optimization

### optimization.runtimeChunk

https://webpack.kr/configuration/optimization/#optimizationruntimechunk

optimization.runtimeChunk를 true 또는 'multiple'로 설정하면 런타임만 포함된 추가 청크가 각 엔트리 포인트에 추가됩니다.

이 대신 'single'값을 설정하면 생성된 모든 청크에서 공유할 런타임 파일을 생성합니다. 이 설정은 다음에 대한 별칭입니다.

```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: "runtime",
    },
  },
};
```

기본값은 false입니다. 각 엔트리 청크에는 런타임이 포함됩니다.

### optimization.minimize

TerserPlugin 또는 optimization.minimizer에 지정된 플러그인을 사용하여 번들을 최소화합니다.

### optimization.minimizer

하나 이상의 다른 TerserPlugin 인스턴스를 제공하여 기본 최소화 도구를 다시 설정할 수 있습니다.

### optimization.splitChunks

See available options for configuring in the SplitChunksPlugin page.

## SplitChunksPlugin

https://webpack.kr/plugins/split-chunks-plugin/#optimizationsplitchunks

optimization.splitChunks 설정 옵션을 적용하면 중복 의존성이 제거할 수 있습니다. Webpack은 다음 조건에 따라 자동으로 청크를 분할합니다.

- 새 청크를 공유 할 수 있거나 모듈이 node_modules 폴더에 있는 경우
- 새 청크가 20kb보다 클 경우(before min+gz)
- 요청 시 청크를 로드할 때 최대 병렬 요청 수가 30개 이하일 경우
- 초기 페이지 로드 시 최대 병렬 요청 수가 30개 이하일 경우

마지막 두 가지 조건을 충족하려고 할 때 더 큰 청크가 선호됩니다.

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // 모든 유형의 청크를 포함합니다.
      chunks: "all",
    },
  },
};
```

### splitChunks.chunks

이것은 최적화를 위해 선택될 청크를 나타냅니다. 문자열이 제공될 때 유효한 값은 all, async 및 initial입니다. all을 제공하는 것은 비동기 청크와 동기 청크 간에도 청크를 공유할 수 있다는 것을 의미하기 때문에 특히 강력할 수 있습니다.

### splitChunks.cacheGroups

https://webpack.kr/plugins/split-chunks-plugin/#splitchunkscachegroups

캐시 그룹은 splitChunks.\*의 모든 옵션을 상속 및(또는) 재정의할 수 있습니다. 그러나 test, priority 및 reuseExistingChunk는 캐시 그룹 수준에서만 구성할 수 있습니다.

## optimize-css-assets-webpack-plugin

https://github.com/NMFR/optimize-css-assets-webpack-plugin \
https://cssnano.co/

A Webpack plugin to optimize \ minimize CSS assets. <u>For webpack v5 or above please use css-minimizer-webpack-plugin instead.</u>

### Installation

```bash
$ npm install --save-dev cssnano optimize-css-assets-webpack-plugin
```

### Options

1\. assetNameRegExp \
A regular expression that indicates the names of the assets that should be optimized \ minimized. The regular expression provided is run against the filenames of the files exported by the ExtractTextPlugin instances in your configuration, not the filenames of your source CSS files.

2\. cssProcessor \
The CSS processor used to optimize \ minimize the CSS, defaults to cssnano.

### Basic Usage

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, { loader: "css-loader" }],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[contenthash].css" }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/i,
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
  ],
};
```

## css-minimizer-webpack-plugin

https://github.com/webpack-contrib/css-minimizer-webpack-plugin

## terser-webpack-plugin

https://github.com/webpack-contrib/terser-webpack-plugin

This plugin uses terser to minify/minimize your JavaScript. Webpack v5 comes with the latest terser-webpack-plugin out of the box. If you are using Webpack v5 or above and wish to customize the options, you will still need to install terser-webpack-plugin.

### Installation

```bash
$ npm install terser-webpack-plugin --save-dev
```

### Basic Usage

```js
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
```

### Others

https://www.npmjs.com/package/uglifyjs-webpack-plugin \
https://www.npmjs.com/package/babel-minify-webpack-plugin \
https://blog.logrocket.com/terser-vs-uglify-vs-babel-minify-comparing-javascript-minifiers/
