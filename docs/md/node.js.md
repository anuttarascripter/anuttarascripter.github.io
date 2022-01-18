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
