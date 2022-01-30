## entry

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

## html-webpack-plugin

https://webpack.kr/plugins/html-webpack-plugin/

### Installation

```bash
$ npm install --save-dev html-webpack-plugin
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

https://webpack.kr/plugins/split-chunks-plugin/#optimizationsplitchunks

webpack v4+에서는 동적으로 가져온 모듈에 새로운 공통 청크 전략을 바로 사용할 수 있습니다.
optimization.splitChunks 설정 옵션을 적용하면 중복 의존성이 제거된 것을 확인 할 수 있습니다.

## mini-css-extract-plugin

https://webpack.kr/plugins/mini-css-extract-plugin/

메인 애플리케이션에서 CSS를 분리하는데 유용합니다.

## Devtool

https://webpack.kr/configuration/devtool/

오류와 경고를 쉽게 추적할 수 있도록, JavaScript는 컴파일된 코드를 원래 소스로 매핑하는 소스맵을 제공합니다.

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
