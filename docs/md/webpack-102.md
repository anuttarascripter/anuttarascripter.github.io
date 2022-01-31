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
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
```

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

## mini-css-extract-plugin

https://webpack.kr/plugins/mini-css-extract-plugin/

메인 애플리케이션에서 CSS를 분리하는데 유용합니다.

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

https://www.npmjs.com/package/normalize.css
