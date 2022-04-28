<p style="text-align: right">2022-04-28</p>

## aws cli 설치 in wsl

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

```bash
$ sudo apt install zip unzip

$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
$ unzip awscliv2.zip
$ sudo ./aws/install
$ aws --version
```

## aws cli 구성 in wsl

https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config

wsl는 .aws 소프트 링크가 존재하므로, 삭제 필요

```bash
$ aws configure
$ aws configure --profile profilename # default: default

AWS Access Key ID [None]: YOUR_ACCESS_KEY
AWS Secret Access Key [None]: YOUR_SECRET_KEY
Default region name [None]: ap-northeast-2 [Asia Pacific (Seoul)]
Default output format [None]: json

# credentials 파일은 ~/.aws/credentials 저장
# config 파일은 ~/.aws/config 저장

$ aws sts get-caller-identity         # 확인
```
