<p style="text-align: right">2022-04-28</p>

## WSL와 Docker Desktop 연결

https://docs.docker.com/go/wsl2 \
https://docs.microsoft.com/ko-kr/windows/wsl/tutorials/wsl-containers \
https://docs.docker.com/desktop/windows/wsl/

wsl에 docker 와 kubectl이 연결됨

```bash
$ docker --version
$ kubectl version
```

### Enable Kubernetes in Docker Desktop

https://docs.docker.com/desktop/kubernetes/

## AWS EKS

```bash
$ aws eks list-clusters     # eks 클러스터 리스트 보기
$ kubectl config view       # 쿠버네티스 config 보기
```

### eks의 클러스터 정보 가져오기

https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/create-kubeconfig.html

```bash
$ aws eks update-kubeconfig --region ap-northeast-2 --name {cluster-name} --alias {cluster-alias}
$ aws eks update-kubeconfig --region ap-northeast-2 --name myeks --alias my-eks

# config 파일은 ~/.kube/config 저장

$ kubectl config view
```

## context 변경

https://kubernetes.io/ko/docs/reference/kubectl/cheatsheet/

```bash
$ kubectl config get-contexts         # context 리스트 보기
$ kubectl config current-context      # 현재 사용중인 context 보기
$ kubectl config use-context my-eks   # context 변경

$ kubectl get pods
```
