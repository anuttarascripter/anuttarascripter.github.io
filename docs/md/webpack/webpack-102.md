<p style="text-align: right">2022-02-01</p>

## Entry

https://webpack.kr/configuration/entry-context/#entry

### Naming

문자열 또는 문자열 배열이 전달되면, 청크 이름은 main입니다. 객체가 전달되면, 객체의 키는 청크의 이름이 되고, 객체의 값은 청크의 엔트리 포인트를 설명합니다.

### Entry descriptor

객체가 전달되면 객체의 값은 문자열, 문자열 배열 또는 디스크립터가 될 수 있습니다.

```js
module.exports = {
  //...
  entry: {
    home: "./home.js",
    moment: { import: "moment-mini", runtime: "runtime" },
    reactvendors: {
      import: ["react", "react-dom"],
      runtime: "runtime",
    },
    catalog: {
      import: "./catalog.js",
      dependOn: ["reactvendors", "moment"],
    },
  },
};
```

디스크립터를 사용하여 추가 옵션을 엔트리 포인트에 전달할 수 있습니다.

단일 HTML 페이지에서 여러 엔트리 포인트를 사용하는 경우 optimization.runtimeChunk: 'single'도 필요합니다.

Although using multiple entry points per page is allowed in webpack, it should be avoided when possible in favor of an entry point with multiple imports: entry: { page: ['./analytics', './app'] }. This results in a better optimization and consistent execution order when using async script tags.

### Dependencies

<u>기본적으로, 모든 엔트리 청크는 사용하는 모든 모듈을 저장합니다.</u> dependOn 옵션을 사용하면 한 엔트리 청크에서 다른 엔트리 청크로 모듈을 공유할 수 있습니다. 또한, 배열을 사용해서 하나의 엔트리에 여러 개의 파일을 지정할 수 있습니다.

## Output

https://webpack.kr/configuration/output/

### output.clean (5.20.0+)

```js
module.exports = {
  //...
  output: {
    clean: true, // 내보내기 전에 output 디렉토리를 정리합니다.
  },
};
```

### output.filename

이 옵션은 각 출력 번들의 이름을 결정합니다. 번들은 output.path 옵션으로 지정된 디렉터리에 작성됩니다.

단일 entry 지점의 경우 정적인 이름으로 설정할 수 있습니다. 그러나 둘 이상의 엔트리 포인트, 코드 분할 또는 다양한 플러그인을 통해 여러 번들을 생성할 때 다음 substitution 중 하나를 사용하여 각 번들에 고유한 이름을 부여해야 합니다.

```js
module.exports = {
  //...
  output: {
    filename: "[name].bundle.js",
  },
};
```

### Template strings

https://webpack.kr/configuration/output/#template-strings

청크 수준에서 사용할 수 있는 substitution입니다.

|               |                                                                                        |
| :------------ | :------------------------------------------------------------------------------------- |
| [id]          | 청크의 identifier                                                                      |
| [name]        | 청크의 이름, 설정되지 않은 경우 청크의 ID                                              |
| [chunkhash]   | 청크의 모든 요소를 포함한 청크의 해시                                                  |
| [contenthash] | 콘텐츠 타입의 요소만 포함하는 청크의 해시 (optimization.realContentHash의 영향을 받음) |

https://medium.com/@sahilkkrazy/hash-vs-chunkhash-vs-contenthash-e94d38a32208

<b>Chunkhash</b>: \
Chunkhash is based on webpack entry point. Each entry defined will have it’s own hash. If anything changes for that particular entry point than only corresponding hash will change.

<b>Contenthash</b>: \
Contenthash is specfic type of hash created in ExtractTextPlugin and is calculated by extracted content not by full chunk content.

### output.publicPath

이것은 온 디맨드 로드를 사용하거나 이미지, 파일 등과 같은 외부 리소스를 로드할 때 중요한 옵션입니다. 이 옵션은 브라우저에서 참조될 때 출력 디렉토리의 공용 URL 을 지정합니다. 상대 URL은 HTML 페이지 또는 \<base>태그를 기준으로 확인됩니다. 서버 상대 URL, 프로토콜 상대 URL 또는 절대 URL도 가능하며 때로는 필요합니다(CDN에서 애셋을 호스팅 하는 경우).

옵션의 값은 런타임 또는 로더가 생성한 모든 URL에 접두사로 추가됩니다. 이 때문에 이 옵션의 값은 대부분의 경우 / 로 끝납니다.

```js
module.exports = {
  //...
  output: {
    // 아래 중 하나
    publicPath: "auto", // `import.meta.url`, `document.currentScript`, `<script />` 또는 `self.location`에서 public path를 자동으로 결정합니다.
    publicPath: "https://cdn.example.com/assets/", // CDN (항상 HTTPS)
    publicPath: "//cdn.example.com/assets/", // CDN (같은 프로토콜)
    publicPath: "/assets/", // 서버의 상대 경로
    publicPath: "assets/", // HTML 페이지의 상대 경로
    publicPath: "../assets/", // HTML 페이지의 상대 경로
    publicPath: "", // HTML 페이지의 상대 경로 (같은 디렉터리)
  },
};
```

## Module

https://webpack.kr/configuration/module

### Rule (module.rules)

https://webpack.kr/configuration/module/#rule

### Rule.oneOf

https://webpack.kr/configuration/module/#ruleoneof

Rule이 일치할 때 첫 번째 일치하는 Rule만 사용되는 Rules의 배열입니다.

#### webpack.config.js

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        oneOf: [
          {
            test: /\.module\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              { loader: "style-loader" },
              // Translates CSS into CommonJS
              {
                loader: "css-loader",
                options: { modules: true },
              },
              // Compiles Sass to CSS
              { loader: "sass-loader" },
            ],
          },
          {
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
          },
        ],
      },
    ],
  },
};
```

## Asset Modules

https://webpack.kr/guides/asset-modules/

애셋 모듈은 로더를 추가로 구성하지 않아도 애셋 파일(폰트, 아이콘 등)을 사용할 수 있도록 해주는 모듈입니다. webpack 5 이전에는 아래의 로더를 사용하는 것이 일반적이었습니다.

- raw-loader, 파일을 문자열로 가져올 때 \
  https://v4.webpack.js.org/loaders/raw-loader/
- url-loader, 파일을 data URI 형식으로 번들에 인라인 추가 할 때 \
  https://v4.webpack.js.org/loaders/url-loader/ \
  https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
- file-loader, 파일을 출력 디렉터리로 내보낼 때 \
  https://v4.webpack.js.org/loaders/file-loader/

## html-webpack-plugin

https://webpack.kr/plugins/html-webpack-plugin/

웹팩에서 만들어진 번들파일들이 주입된 html 파일을 생성해준다.

### Installation

```bash
$ npm install --save-dev html-webpack-plugin
```

### Options

https://github.com/jantimon/html-webpack-plugin#options

1\. title \
The title to use for the generated HTML document

2\. filename \
The file to write the HTML to. Defaults to index.html. You can specify a subdirectory here too (eg: assets/admin.html). The [name] placeholder will be replaced with the entry name.

3\. template \
webpack relative or absolute path to the template. By default it will use src/index.ejs if it exists. By default (if you don't specify any loader in any way) a fallback ejs loader kicks in. Please note that this loader does not support the full ejs syntax as it is based on lodash template.

https://github.com/jantimon/html-webpack-plugin/blob/main/docs/template-option.md

Template processor allows to use any webpack loader:

- pug
- ejs
- underscore
- handlebars
- html-loader
- ...

Under the hood it is using a webpack child compilation which inherits all loaders from your main configuration.

There are three ways to set the loader:

- Don't set any loader
- Setting a loader directly for the template
- Setting a loader using the module.rules syntax

4\. templateParameters \
Allows to overwrite the parameters used in the template \
https://github.com/jantimon/html-webpack-plugin/tree/main/examples/template-parameters

5\. meta \
Allows to inject meta-tags.meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}

6\. minify \
Controls if and in what ways the output should be minified. \
https://github.com/jantimon/html-webpack-plugin#minification

### Basic Usage

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // default
      title: "Webpack App",
      filename: "index.html",
      template: "src/index.ejs",
      // meta: {
      //   viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
      // },
      minify: true, // true if mode is 'production', otherwise false
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
```

## mini-css-extract-plugin

https://webpack.kr/plugins/mini-css-extract-plugin/

메인 애플리케이션에서 CSS를 분리하는데 유용합니다.
This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.

### Installation

```bash
$ npm install --save-dev mini-css-extract-plugin
```

### Options

https://github.com/jantimon/html-webpack-plugin#options

1\. filename \
This option determines the name of each output CSS file. Works like output.filename

### Basic Usage

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css", // default
      // filename: "[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          // { loader: "style-loader" },
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
        ],
      },
    ],
  },
};
```

## Devtool

https://webpack.kr/configuration/devtool/

오류와 경고를 쉽게 추적할 수 있도록, JavaScript는 컴파일된 코드를 원래 소스로 매핑하는 소스맵을 제공합니다.

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
  },
  devtool: "source-map",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
```

|                   |                                                                               |
| :---------------- | :---------------------------------------------------------------------------- |
| (none)            | 최대 성능을 갖춘 프로덕션 빌드를 위해 추천하는 옵션입니다. (production)       |
| source-map        | 고품질 소스맵을 포함한 프로덕션 빌드를 위해 추천하는 옵션입니다. (production) |
| inline-source-map | 단일 파일을 내보낼 때 선택할 수 있습니다.                                     |

https://stackoverflow.com/questions/44315460/when-do-browsers-download-sourcemaps

Source Maps are downloaded and attached to the browser when you open the developer tools. Until then the browser is not aware of the sourceMap.

There is a code reference to the Chrome's Dev tools

```js
this._sourceMapManager.setEnabled(
  Common.moduleSetting("jsSourceMapsEnabled").get()
);
```

## ETC

https://www.npmjs.com/package/normalize.css \
https://postcss.org/ \
https://www.npmjs.com/package/postcss-loader \
https://www.npmjs.com/package/webpack-merge
