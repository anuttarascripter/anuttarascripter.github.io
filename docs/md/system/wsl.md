<p style="text-align: right">2022-01-16</p>

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

# Et Cetera

## Distros Location

https://adamtheautomator.com/windows-subsystem-for-linux/

```
%USERPROFILE%\AppData\Local\Packages\
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
