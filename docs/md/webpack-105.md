<p style="text-align: right">2022-02-01</p>

## Code Splitting

https://webpack.kr/guides/code-splitting/

### Dynamic Imports

https://webpack.kr/guides/code-splitting/#dynamic-imports

- import()구문을 사용하는 방식입니다.
- 기존의 webpack 전용 방식은 require.ensure를 사용하는 것입니다.

lodash를 동적으로 가져와서 청크를 분리합니다.

```js
async function getComponent() {
  const element = document.createElement("div");
  const { default: _ } = await import("lodash");
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  return element;
}

getComponent().then((component) => {
  document.body.appendChild(component);
});
```

default가 필요한 이유는 webpack 4 이후로 CommonJS 모듈을 가져올 때 더 이상 module.exports 값 으로 해석되지 않으며 대신 CommonJS 모듈에 대한 인공 네임 스페이스 객체를 생성하기 때문입니다.

### Prefetching/Preloading modules

https://webpack.kr/guides/code-splitting/#prefetchingpreloading-modules

모듈을 가져올 때 인라인 지시문을 사용하면 webpack이 브라우저에 아래와 같은 "리소스 힌트"를 줄 수 있습니다.

- prefetch : 향후 일부 탐색에 리소스가 필요할 수 있습니다.
- preload : 현재 탐색 중에 리소스도 필요합니다.

```js
import(/* webpackPrefetch: true */ "./path/to/LoginModal.js");
```

이는 페이지 head에 \<link rel="prefetch" href="login-modal-chunk.js">를 추가하고 브라우저에 login-modal-chunk.js를 유휴 시간에 미리 가져오도록 지시합니다

## Caching

https://webpack.kr/guides/caching/

### Output Filenames

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //...
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
```

### Extracting Boilerplate

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //...
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    // 런타임 코드를 별도의 청크로 분할
    runtimeChunk: "single",
    // 타사 라이브러리를 별도의 vendor 청크로 추출
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
```

## Lazy Loading

https://webpack.kr/guides/lazy-loading/

```js
function component() {
  const button = document.createElement("button");
  button.innerHTML = "Click me and look at the console!";
  button.onclick = (e) =>
    import(/* webpackChunkName: "print" */ "./print").then((module) => {
      const print = module.default;
      print();
    });

  return button;
}

document.body.appendChild(component());
```

### React: Code Splitting and Lazy Loading

https://reactjs.org/docs/code-splitting.html

## Example

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: {
      import: ["./src/another.js", "./src/index.js"],
      dependOn: "shared",
    },
    print: "./src/print.js",
    shared: "./src/shared.js",
    // shared: "lodash",
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Caching",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
    // splitChunks: {
    //   chunks: "all",
    // },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
```
