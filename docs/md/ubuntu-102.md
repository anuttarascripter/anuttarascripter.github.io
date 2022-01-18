## apt (Advanced package tool)

```bash
$ sudo apt install {package-name}
$ sudo apt remove {package-name}    # package 삭제
$ sudo apt purge {package-name}     # package와 관련 설정 제거
$ sudo apt update                   # repository 인덱스 갱신
$ sudo apt upgrade                  # 업그레이드 가능한 모든 패키지 업그레이드
$ sudo apt autoremove               # 불필요한 패키지 제거
$ sudo apt search {package-name}    # package 검색
$ sudo apt show {package-name}      # package 정보 출력
$ sudo apt lis                      # 설치된 package 검색
```

## sshd

```bash
$ systemctl status sshd
$ sudo apt install openssh-server
$ systemctl start sshd
$ systemctl status sshd
$ systemctl status ssh.service
```

```bash
$ sudo apt install net-tools
$ ifconfig
# https://www.freedesktop.org/wiki/Software/systemd/PredictableNetworkInterfaceNames/
```

## ETC

```bash
$ lsb_release -a              # Ubuntu version check

$ top                         # CPU 사용률 체크

$ sudo su                     # 관리자 권한 모드 진입

$ node app.js &               # 백그라운드로 실행
$ node app.js > app.out.log 2> app.err.log < /dev/null &
$ nohup node app.js &

$ ln -s {TARGET} {LINK_NAME}  # symlink(soft link) 생성

$ rm {FILE_NAME}              # 파일삭제
```
