# Install

Mirror site \
http://kr.archive.ubuntu.com/ubuntu/ \
http://mirror.kakao.com/ubuntu-releases/xenial/

```
ubuntu-16.04.7-desktop-amd64.iso
```

<br/>

# 운영체제의 구조와 특징

## 운영체제의 부팅 과정

1. ROM BIOS: Basic Input/Output System \
   BIOS는 운영 체제 중 가장 기본적인 소프트웨어이자 컴퓨터의 입출력을 처리하는 메인보드의 펌웨어다. POST(Power On Self Test) 및 부팅정보가 기록된 저장장치의 MBR를 읽는다. \
   https://velog.io/@hyun0310woo/13-운영체제-부팅 \
   https://kkhipp.tistory.com/179

2. MBR: Master Boot Record \
   HDD와 같은 대용량 저장장치의 0번 섹터 (512 Byte)로 Bootstrap code (Bootloader), Partition table, Boot signature 등으로 구성된다. BIOS가 Bootloader 이미지를 메모리에 로드한다. \
   http://melonicedlatte.com/computerarchitecture/2019/09/11/171200.html \
   https://symnoisy.tistory.com/entry/4부팅과-부트로더1이론

3. Bootloader (First-stage boot loader) \
   Bootloader란 운영 체제가 시동되기 이전에 미리 실행되면서 커널이 올바르게 시동되기 위해 필요한 모든 관련 작업을 마무리하고 최종적으로 운영 체제를 시동시키기 위한 목적을 가진 프로그램을 말한다. Kernel을 로드한다.

   \* Second-stage boot loader, GRUB: Grand Unified Bootloader (멀티 부팅 및 복구) \
   https://intgeek.tistory.com/5

```bash
$ cd /boot
$ ls -al
$ ls -al grub
-r--r--r-- 1 root root    7866 Nov 29 23:37 grub.cfg
# /boot/grub/grub.cfg을 읽어서 부팅 커널을 결정

$ ls -al /etc/grub.d
$ ls -al /etc/default/grub.d
# /etc/grub.d/* 와 /etc/default/grub.d을 통해서 생성됨
```

4. Kernel \
   메모리에 상주하는 운영체제 핵심 부분 \
   /sbin/init (PID 1)을 실행 (init -> /lib/systemd/systemd) \
   initrd 패지키의 실행 \
   https://richong.tistory.com/348 \
   https://wiki.kldp.org/Translations/html/Initrd-KLDP/Initrd-KLDP.html

5. Init process \
   컴퓨터 시스템의 부팅 과정 중 최초의 프로세스 (PID 1)로 루트 유저 프로세스로 systemd등의 부팅 과정 수행 \
   /etc/inittab 등 실행 (이제 사용되지 않음) \
   https://askubuntu.com/questions/34308/where-is-the-inittab-file \
   http://soopsaram.com/lfs/markdowns/7_System_Configuration_and_Bootscripts.html

6. Runlevel \
   A runlevel is a mode of operation in the computer operating systems that implements Unix System V-style initialization. A runlevel defines the state of the machine after boot.
   소프트웨어 부트 스크립트 \
   /etc/rc\*.d/ (Resource Control)\
   https://dongle94.github.io/ubuntu/ubuntu-runlevel/ \
   https://m31phy.tistory.com/242?category=825986

```bash
$ runlevel
N 5
$ who -r

$ sudo systemctl get-default
graphical.target

$ ls /lib/systemd/system/default.target -al
lrwxrwxrwx 1 root root 16 Sep  7 18:37 /lib/systemd/system/default.target -> graphical.target

$ ls /lib/systemd/system/runlevel?.target -al
lrwxrwxrwx 1 root root 15 Sep  7 18:37 /lib/systemd/system/runlevel0.target -> poweroff.target
lrwxrwxrwx 1 root root 13 Sep  7 18:37 /lib/systemd/system/runlevel1.target -> rescue.target
lrwxrwxrwx 1 root root 17 Sep  7 18:37 /lib/systemd/system/runlevel2.target -> multi-user.target
lrwxrwxrwx 1 root root 17 Sep  7 18:37 /lib/systemd/system/runlevel3.target -> multi-user.target
lrwxrwxrwx 1 root root 17 Sep  7 18:37 /lib/systemd/system/runlevel4.target -> multi-user.target
lrwxrwxrwx 1 root root 16 Sep  7 18:37 /lib/systemd/system/runlevel5.target -> graphical.target
lrwxrwxrwx 1 root root 13 Sep  7 18:37 /lib/systemd/system/runlevel6.target -> reboot.target

$ sudo systemctl set-default multi-user.target
```

## 파일 시스템 마운트

```bash
cat /etc/fstab
# file systems table
```

## Boot process

Ubuntu 16.04 이후부터는 systemd 적용 \
(System-V init service => Upstart init service (14.04) => systemd boot process (16.04))

### systemd

[ Targets ] \
runlevel0.target, halt.target, poweroff.target: System shutdown \
runlevel1.target, rescue.target : Single-user mode \
runlevel2.target, multi-user.target: Local multiuser without remote network \
runlevel3.target, multi-user.target: Full multiuser with network \
runlevel4.target: Unused/User-defined \
runlevel5.target, graphical.target: Full multiuser with network and display manager \
runlevel6.target, reboot.target: System reboot

```bash
$ sudo systemctl get-default
$ sudo systemctl enable multi-user.target
$ sudo systemctl set-default multi-user.target

$ sudo systemctl restart network-manager
```

systemd를 통한 부트 시퀀스

```bash
$ ls /etc/systemd/system/multi-user.target.wants/ -al
```

나만의 프로세스 만들기

```bash
$ cd /lib/systemd/system/myservice.service

$ sudo systemctl daemon-reload
$ sudo systemctl enable myservice
$ sudo systemctl start myservice
$ sudo systemctl status myservice
$ sudo systemctl stop myservice
$ sudo systemctl disable myservice
```

### init (SysV 및 Upstart)

[ Runlevel ] \
0 - Halt \
1 - Single-user text mode \
2 - Not used (user-definable) \
3 - Full multi-user text mode \
4 - Not used (user-definable) \
5 - Full multi-user graphical mode (with an X-based login screen) \
6 - Reboot

```bash
$ cat /etc/inittab
$ init 3
$ init 5

$ sudo service --status-all
$ sudo service network-manager restart
```

<br/>

# 파일시스템 및 디렉토리 구조

Filesystem Hierarchy Standard (FHS) \
https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard

### root

```
/       : 기본 계층 모든 파일 시스템 계층의 기본인 루트 디렉토리
/bin    : 모든 사용자를 위해 단일 사용자 모드에서 사용 가능해야 하는 명령어 바이너리
/boot   : 부트 로더 파일 (GRUB, Kernel)
/dev    : 필요한 장치 e.g. /dev/null.
/etc    : 특정 호스트 시스템의 전반적인 설정 파일
/home   : 저장된 파일, 개인 설정, 기타 등을 포함한 사용자의 홈 디렉토리
/lib    : /bin/과 /sbin/에 있는 바이너리에 필요한 라이브러리
/media  : CD-ROM과 같은 이동식 미디어의 마운트 지점
/mnt    : 임시로 마운트된 파일 시스템
/proc   : 커널과 프로세스 상태를 문서화한 가상 파일 시스템 (Pseudo File System)
/root   : 루트 사용자의 홈 디렉토리
/sbin   : 필수 시스템 바이너리, e.g., init, ip, mount.
/tmp    : 임시 파일
/usr    : 읽기 전용 사용자 데이터가 있는 보조 계층 구조
/var    : 변하기 쉬운 파일—일반적인 시스템의 운영 체제에서 내용이 자주 바뀔 듯한 파일
```

### usr

```
/usr/bin      : 모든 사용자의(단일 사용자 모드에서 필요하지 않은) 비 필수 명령어 바이너리
/usr/include  : 표준 include 파일.
/usr/lib      : /usr/bin/과 /usr/sbin/에 있는 바이너리를 위한 라이브러리.
/usr/sbin     : 비 필수 시스템 바이너리, e.g., 다양한 네트워크 서비스 데몬.
/usr/share    : 아키텍처에 독립적인(공유) 데이터.
/usr/src      : 소스 코드, e.g. 커널 소스 코드와 그 헤더 파일.
```

### var

```
/var/cache    : 애플리케이션 캐시 데이터
/var/lib      : 상태 정보. 프로그램의 실행 중에 수정되는 영구적인 데이터.
/var/lock     : 잠금 파일. 현재 사용중인 자원을 추적하는 파일.
/var/log      : 로그 파일.
/var/run      : 마지막 부트 때부터 작동하는 시스템에 대한 정보
/var/spool    : 처리를 기다리는 작업 스풀. e.g. 큐 출력과 읽지 않은 메일.
/var/tmp      : 재부팅 해도 보존되는 임시 파일.
```
