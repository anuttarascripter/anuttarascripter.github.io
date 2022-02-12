<p style="text-align: right">2022-02-01</p>

## NVM 설치

https://github.com/nvm-sh/nvm

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
$ cat ~/.bashrc
```

node.js 설치

```bash
$ nvm help
$ nvm ls-remote
$ nvm install --lts
$ nvm ls
$ node -v
```

일반 사용자도 사용할 수 있게 심볼릭 링크 만들기 (optional)

```
$ nvm install --lts
$ sudo ln -s "$NVM_DIR/versions/node/{version}/bin/node" "/usr/local/bin/node"
$ sudo ln -s "$NVM_DIR/versions/node/{version}/bin/npm" "/usr/local/bin/npm"
$ sudo ln -s "$NVM_DIR/versions/node/{version}/bin/npx" "/usr/local/bin/npx"
```

## package.json

https://docs.npmjs.com/cli/v8/configuring-npm/package-json

### main

The main field is a module ID that is the primary entry point to your program.
If a user imports your module, your main module's exports object will be returned.
If main is not set it defaults to index.js in the packages root folder.

### engines

You can specify the version of node that your stuff works on:

```json
{
  "engines": {
    "node": ">=0.10.3 <15"
  }
}
```

### private

If you set "private": true in your package.json, then npm will refuse to publish it.

```diff
{
- "main": "index.js",
+ "private": true
}
```

## npx

https://docs.npmjs.com/cli/v8/commands/npx

This command allows you to run an arbitrary command from an npm package (either one installed locally, or fetched remotely), in a similar context as running it via npm run.

로컬 설치된 모듈을 npx로 실행하는 경우, ./node_modules/.bin 폴더의 각 Shell Script를 직접 실행한다.

```bash
$ npx webpack
$ ./node_modules/.bin/webpack # bash shell인 경우 bash shell script가 실행
```

### npx vs npm exec

https://docs.npmjs.com/cli/v8/commands/npx#npx-vs-npm-exec