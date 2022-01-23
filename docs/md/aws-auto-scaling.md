## Amazon Machine Image (AMI) 생성

```
Taget EC2의 Image 생성, 이름 설정
```

## Launch Template 생성

```
Launch template name    : 이름 설정
Provide guidance        : 체크
AMI                     : 해당 Image 선택
Instance type           : t2.micro
Key pair name           : 해당 Key pair 선택
Security groups         : 해당 보안그룹 선택
User Data               : 부팅후 실행될 Shell Script 작성
# cloud-init pat        : /var/log/cloud-init-output.log
# user-data path        : /var/lib/cloud/instance/user-data.txt
```

```bash
#!/bin/bash
cd /home/ubuntu/code
node app.js &
```

## Target groups 생성

```
target type             : Instances
Target group name       : 이름 설정
Protocol:Port           : HTTP:80 LB에서 EC2의 어디포트로 전송할지
Health checks           : HTTP / 서버 상태확인용 url
Available instances에서 해당하는 EC2 서버를 선택하고 include as pending below
```

## ALB 생성

```
Load balancer name      : 이름 설정
Scheme                  : internet-facing
IP address type         : IPv4
Network mapping         : 모든 AZ 선택
Listeners               : 사용자가 로드밸런서에 요청 방법 및 Target groups 할당 (HTTPS:443)
Security groups         : 보안그룹 적용, ALB에 맞는 새보안그룹 생성 (ec2와 같은것)
Listeners and routing   : 기존 Taget group 에서 선택
```

## Auto Scaling group 생성

```
Auto Scaling group name : 이름 설정
Launch template         : 해당 Launch Template 선택
Launch template.version : Latest(1)
Network.subnet          : 모든 subnet 선택
Load Balancing          : 기존 로드 밸런스에 연결, 해당 ALB 선택, 로드 밸런서 대상 그룹에서 선택
Health check type       : ELB
Monitoring              : CloudWatch ...  체크
Groups Size             : instance 갯수, Desired: 1, Min: 1, Max: 4
Scaling Policies        : 대상 추적 조정 정책, 지표(CPU 사용률), 대상값(50 %), 웜업(300 초)
Tag                     : Name 태그에 이름 넣고, 새 인스턴스에 태그 지정체크, 생성될 ec2 이름 설정
```

https://kr-id-general.workshop.aws/en/advanced_modules/database/update_asg.html \
https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html
