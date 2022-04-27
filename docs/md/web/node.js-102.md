<p style="text-align: right">2022-04-28</p>

## yarn 설치 및 사용

https://yarnpkg.com/

```bash
$ corepack enable           # yarn 설치/활성화?
# $ yarn init -2            # generates the project using Yarn 2
```

https://yarnpkg.com/getting-started/usage

```bash
$ yarn init                 # 프로젝트 초기화
$ yarn install              # package.json 패키지 리스트 설치
$ yarn add [package]        # 패키지 설치
$ yarn add [package] --dev  # 패키지 설치 (dev)
```

## Typescript

https://www.typescriptlang.org/ \
https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html

```bash
$ yarn add typescript --dev # 필수 패키지 설치
$ yarn tsc                  # ts 컴파일
```

### tsconfig.json (Configuration File)

https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html \
https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

### ts-node

https://typestrong.org/ts-node/ \
https://www.npmjs.com/package/ts-node

TypeScript execution engine and REPL for Node.js.

```bash
$ yarn ts-node --version
$ yarn ts-node              # REPL

# flags
# -r, --require [path]  : Require a node module before execution
# -T, --transpileOnly   : Use TypeScript's faster transpileModule
```

### ts-node-dev

https://www.npmjs.com/package/ts-node-dev \
https://www.npmjs.com/package/node-dev

TS version of node-dev that uses ts-node under the hood

```bash
$ yarn add ts-node-dev --dev

$ yarn ts-node-dev ./src/app.ts
$ yarn ts-node-dev --respawn ./src/app.ts
$ yarn ts-node-dev -r tsconfig-paths/register --respawn --transpile-only src/app.ts

# flags
# -r tsconfig-paths/register
# --respawn             : Keep watching for changes after the script has exited (node-dev)
# --transpile-only
```

## Tslint

https://palantir.github.io/tslint/

```bash
$ yarn add tslint --dev
$ yarn tslint --init        # generate tslint.json
```

### TSLint command-line interface and Configuring TSLint

https://palantir.github.io/tslint/usage/cli/ \
https://palantir.github.io/tslint/usage/configuration/

```bash
$ yarn tslint --help

$ yarn tslint -c tslint.json 'src/**/\*.ts'
$ yarn tslint --fix -c tslint.json 'src/**/\*.ts'
$ yarn tslint -p .
```

## Prettier

https://prettier.io/

### Install

https://prettier.io/docs/en/install.html

```bash
$ yarn add --dev --exact prettier
$ yarn prettier --write .         # npx prettier --write .
$ yarn prettier --check .
```

### Configuration File

https://prettier.io/docs/en/configuration.html

- A .prettierrc file written in JSON or YAML.

### Integrating with Linters

https://prettier.io/docs/en/integrating-with-linters.html

- use Prettier for formatting and linters for catching bugs!
- tslint-config-prettier: turn off rules that conflict

## TSlint with Prettier

### tslint-config-prettier

https://www.npmjs.com/package/tslint-config-prettier

```bash
$ yarn add --dev tslint-config-prettier
$ yarn tslint-config-prettier-check ./tslint.json # check rule to conflict with prettier
```

[tslint.json]

```json
{
  "extends": ["tslint:latest", "tslint-config-prettier"]
}
```

### tslint-plugin-prettier

https://www.npmjs.com/package/tslint-plugin-prettier

```bash
$ yarn add --dev tslint-plugin-prettier
```

[tslint.json]

```json
{
  "rulesDirectory": ["tslint-plugin-prettier"],
  "rules": { "prettier": true }
}
```

```bash
$ yarn tslint -c tslint.json 'src/**/\*.ts'
$ yarn tslint --fix -c tslint.json 'src/**/\*.ts'
$ yarn tslint --fix -p .
```
