## webpack 설치 및 실행

https://webpack.js.org/

```bash
$ npm install webpack webpack-cli --save-dev
```

webpack.config.js가 있으면 webpack 명령은 기본으로 이것을 선택합니다.

```bash
$ npx webpack
$ npx webpack --config prod.config.js
```

## webpack Concepts

webpack은 모던 JavaScript 애플리케이션을 위한 정적 모듈 번들러 입니다.

### 1. Entry

Webpack은 엔트리 포인트가 (직간접적으로) 의존하는 다른 모듈과 라이브러리를 찾아냅니다.

```js
module.exports = {
  entry: {
    // default
    main: "./src/index.js",
  },
};
```

### 2. Output

output 속성은 생성된 번들을 내보낼 위치와 이 파일의 이름을 지정하는 방법을 webpack에 알려주는 역할을 합니다.

```js
const path = require("path");

module.exports = {
  output: {
    // default
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
};
```

### 3. Loaders

webpack은 기본적으로 JavaScript와 JSON 파일만 이해합니다.

로더를 사용하면 webpack이 다른 유형의 파일을 처리하거나, 그들을 유효한 모듈로 변환 하여 애플리케이션에서 사용하거나 디펜던시 그래프에 추가합니다.

```bash
$ npm install --save-dev style-loader css-loader
```

webpack은 import와 export 문 이외는 코드를 변경하지 않습니다. 다른 ES2015 기능을 사용한다면 webpack의 로더 시스템인 Babel을 트랜스파일러로 사용해야 합니다.

```js
module.exports = {
  module: {
    rules: [
      {
        // 변환이 필요한 파일(들)을 식별하는 test 속성
        test: /\.css$/i,

        // 변환을 수행하는데 사용되는 로더를 가리키는 use 속성
        use: [
          {
            loader: "style-loader",
            options: {
              // 합쳐서 하나의 style 태그 생성
              injectType: "singletonStyleTag",
            },
          },
          {
            loader: "css-loader",
            options: {
              // 모듈화를 위해 css의 class, id 이름을 재생성
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

모듈 로더는 체인으로 연결할 수 있습니다. 체인의 각 로더는 리소스에 변형을 적용합니다. 체인은 역순으로 실행됩니다. 첫 번째 로더는 결과(변형이 적용된 리소스)를 다음 로더로 전달합니다. 마지막으로 webpack은 체인의 마지막 로더가 JavaScript를 반환할 것으로 예상합니다.

https://webpack.kr/concepts/loaders

로더는 오른쪽에서 왼쪽으로 (또는 아래에서 위로) 평가/실행됩니다. 위의 예제에서는 css-loader로 실행이 시작되고, style-loader로 끝납니다.

#### Asset Modules (webpack 5)

https://webpack.kr/guides/asset-modules/

애셋 모듈은 로더를 추가로 구성하지 않아도 애셋 파일(폰트, 아이콘 등)을 사용할 수 있도록 해주는 모듈입니다. 이미지도 webpack 5부터 내장된 Asset Modules를 사용하여 시스템에 쉽게 통합할 수 있습니다.

### 4. Plugins

플러그인을 활용하여 번들을 최적화하거나, 애셋을 관리하고, 또 환경 변수 주입등과 같은 광범위한 작업을 수행 할 수 있습니다.

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  plugins: [
    // https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: "hello webapack",
      // By default (if you don't specify any loader in any way) a fallback ejs loader kicks in.
      // This loader does not support the full ejs syntax as it is based on lodash template.
      template: "src/index.ejs", // default
      meta: {
        viewport: "width=device-width, initial-scale=1.0",
      },
    }),
    // 기존 생성된 번들파일 삭제후 재생성
    new CleanWebpackPlugin(),
  ],
};
```

https://stackoverflow.com/questions/41470771/webpack-does-the-order-of-plugins-matter \
https://webpack.kr/plugins/html-webpack-plugin/

### 5. Mode

mode 파라미터를 development, production 또는 none으로 설정하면 webpack에 내장된 환경별 최적화를 활성화 할 수 있습니다.

```js
module.exports = {
  mode: "production", // default
};
```

### 6. Targets

https://webpack.kr/concepts/targets/ \
https://webpack.kr/configuration/target/

JavaScript는 서버와 클라이언트 모두 작성이 가능하기 때문에 webpack은 webpack 설정에서 다수의 배포 대상을 제공합니다.

```js
module.exports = {
  target: "web", // default
  // target: "browserslist", // default if browserslist config is available
  // https://github.com/browserslist/browserslist#queries
  // package.json | .browserslistrc
};
```

https://joshua1988.github.io/webpack-guide/guide.html
