<p style="text-align: right">2024-02-11</p>

# Manual installation

https://docs.microsoft.com/en-us/windows/wsl/install \
https://docs.microsoft.com/en-us/windows/wsl/install-manual

## Step 1 - Enable the Windows Subsystem for Linux

```ps
PS> dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

## Step 2 - Check requirements for running WSL 2

To update to WSL 2, you must be running Windows 10.

For x64 systems: Version 1903 or higher, with Build 18362 or higher. \
For ARM64 systems: Version 2004 or higher, with Build 19041 or higher.

## Step 3 - Enable Virtual Machine feature

```ps
PS> dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

## Step 4 - Download the Linux kernel update package

1. Download the latest package: WSL2 Linux kernel update package for x64 machines

2. Run the update package downloaded in the previous step. (Double-click to run - you will be prompted for elevated permissions, select ‘yes’ to approve this installation.)

## Step 5 - Set WSL 2 as your default version

```ps
PS> wsl --set-default-version 2
```

<br/>

# Basic commands for WSL

https://docs.microsoft.com/ko-kr/windows/wsl/basic-commands

```cmd
> wsl --help

REM Install
> wsl --install
> wsl --install --distribution <Distribution Name>
> wsl --install -d Ubuntu-20.04

REM List available Linux distributions
> wsl --list --online

REM List installed Linux distributions
> wsl --list --verbose

REM Set WSL version
> wsl --set-version <distribution name> <versionNumber>
> wsl --set-default-version <Version>

REM Run a specific Linux distribution
> wsl --distribution <Distribution Name> --user <User Name>
> wsl -d <Distribution Name> -u <User Name>
> wsl -d UbuntuAWS

> wsl -d UbuntuDEV -u meliu ip address
> wsl -d UbuntuDEV -u meliu hostname -I

REM Terminate
> wsl --terminate <Distribution Name>

REM Export a distribution to a TAR file
> wsl --export <Distribution Name> <FileName>
> wsl --export Ubuntu ubuntu.tar
> wsl --export Ubuntu-20.04 ubuntu_20_04.tar

REM Import a new distribution
> wsl --import <Distribution Name> <InstallLocation> <FileName>
> wsl --import UbuntuAWS .\UbuntuAWS ubuntu.tar
> wsl --import UbuntuPython .\UbuntuPython ubuntu.tar
> wsl --import UbuntuAWS .\wsl\UbuntuAWS ubuntu_20_04.tar

REM Unregister or uninstall a Linux distribution
> wsl --unregister <DistributionName>
> wsl --unregister Ubuntu-20.04
```

## Create User

```bash
$ NEW_USER=<USERNAME>
$ useradd -m -G sudo -s /bin/bash "$NEW_USER"
$ passwd "$NEW_USER"

$ cat <<EOF >> wsl.conf
[user]
default=${NEW_USER}
EOF
```

<br/>

# WSL Networking

## Accessing network applications with WSL

https://learn.microsoft.com/ko-kr/windows/wsl/networking

```bash
$ ip route show | grep -i default | awk '{ print $3}'
```

```cmd
> netsh interface portproxy add v4tov4 listenport=<yourPortToForward> listenaddress=0.0.0.0 connectport=<yourPortToConnectToInWSL> connectaddress=(wsl hostname -I)
> netsh interface portproxy add v4tov4 listenport=8801 listenaddress=0.0.0.0 connectport=8801 connectaddress=192.168.101.65
```

## Firewall

https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/configure-with-command-line
https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/netsh-advfirewall-firewall-control-firewall-behavior

```cmd
> netsh advfirewall firewall show rule name=all
> netsh advfirewall firewall show rule name="Allow_TCPs"
> netsh advfirewall firewall add rule name="Allow_TCPs" dir=in action=allow protocol=TCP localport=80,443,8000-8899
> netsh advfirewall firewall delete rule name="Allow_TCPs"
```

# Et Cetera

## Distros Location

https://adamtheautomator.com/windows-subsystem-for-linux/

```
%USERPROFILE%\AppData\Local\Packages\
```

## netsh

```
> netsh interface portproxy show v4tov4
> netsh interface portproxy add v4tov4 listenport=2200 listenaddress=0.0.0.0 connectport=2200 connectaddress=127.0.0.1
> netsh interface portproxy delete v4tov4 listenport=2200 listenaddress=0.0.0.0
```

## 윈도우즈와 파일공유

리눅스에서 윈도우즈 경로

```
/mnt/c/Users/
```

```bash
$ cp {src} {dest}
$ cp /mnt/c/Users/wsl/private.pem ~/private.pem
$ mv {src} {dest}
$ mv /mnt/c/Users/wsl/private.pem ~/private.pem
$ rm ~/private.pem
```

## WSL VSCode 접속

https://docs.microsoft.com/ko-kr/windows/wsl/tutorials/wsl-vscode

## WSL GUI 설치

https://docs.microsoft.com/ko-kr/windows/wsl/tutorials/gui-apps
