<p style="text-align: right">2022-04-28</p>

## terraform 설치

https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-using-native-package-management

```bash
$ sudo apt-get update
$ sudo apt-get install -y apt-transport-https ca-certificates curl

$ sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg

$ echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

$ sudo apt-get update
$ sudo apt-get install -y kubectl
```

### terraform 설치 in wsl

https://learn.hashicorp.com/tutorials/terraform/install-cli?in=terraform/docker-get-started

```bash
$ sudo apt-get update && sudo apt-get install -y gnupg software-properties-common curl
$ curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
$ sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
$ sudo apt-get update && sudo apt-get install terraform
$ terraform -help
```

### using chocolatey (windows)

```bash
$ choco install terraform
$ terraform -help
```
