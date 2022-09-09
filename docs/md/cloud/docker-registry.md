<p style="text-align: right">2022-09-09</p>

## private registry 구축

https://docs.docker.com/registry/deploying \
https://hub.docker.com/_/registry \
https://github.com/distribution/distribution

```bash
$ docker run -d -p 5001:5000 --restart=always --name registry registry:2
$ docker run -d -p 5001:5000 --restart=always --name registry \
  -e REGISTRY_STORAGE_DELETE_ENABLED=true \
  -v C:\users\...\docker-volumes\registry:/var/lib/registry \
  registry:2

# push to private registry
$ docker pull busybox:1.35.0
$ docker tag busybox:1.35.0 localhost:5001/my-busybox:1.35.0
$ docker push localhost:5001/my-busybox:1.35.0
$ docker rmi localhost:5001/my-busybox:1.35.0
$ docker pull localhost:5001/my-busybox:1.35.0

# push to private registry
$ docker build -t 192.168.0.69:5001/express-test:0.0.2 .
$ docker push 192.168.0.69:5001/express-test:0.0.2

$ docker run -d -p 8083:8083 --name express-test 192.168.0.69:5001/express-test:0.0.2
$ docker logs -f express-test
$ docker exec -it express-test /bin/bash
```

### registry api

https://docs.docker.com/registry/spec/api \
https://stackoverflow.com/questions/25436742/how-to-delete-images-from-a-private-docker-registry

```bash
$ curl http://localhost:5001/v2/_catalog
$ curl http://localhost:5001/v2/express-test/tags/list

$ curl -v -X GET http://localhost:5001/v2/
$ curl -v -X GET http://localhost:5001/v2/my-busybox/manifests/latest
$ curl -v -X HEAD http://localhost:5001/v2/my-busybox/manifests/latest

# get digest for delete
$ curl -v -H "Accept: application/vnd.docker.distribution.manifest.v2+json" -X GET http://localhost:5001/v2/my-busybox/manifests/latest
# sha256:b7362a56f02a9312093492d1a02fabd807b4830c393211d93f22de89f1f845da

# delete
# For deletes, reference must be a digest or the delete will fail.
$ curl -v --silent -H "Accept: application/vnd.docker.distribution.manifest.v2+json" -X DELETE http://localhost:5001/v2/my-busybox/manifests/sha256:b7362a56f02a9312093492d1a02fabd807b4830c393211d93f22de89f1f845da
```

## insecure registry 등록

### docker

https://docs.docker.com/registry/insecure

Edit the daemon.json file, whose default location is /etc/docker/daemon.json on Linux or C:\ProgramData\docker\config\daemon.json on Windows Server. If you use Docker Desktop for Mac or Docker Desktop for Windows, click the Docker icon, choose Preferences (Mac) or Settings (Windows), and choose Docker Engine.

```json
{
  "insecure-registries": ["192.168.0.69:5001"]
}
```

### containerd (rancher)

https://rancher.com/docs/k3s/latest/en/advanced/#configuring-containerd \
https://stackoverflow.com/questions/72419513/how-to-pull-docker-image-from-a-insecure-private-registry-with-latest-kubernetes

For advanced customization for this file you can create another file called config.toml.tmpl in the same directory and it will be used instead.

```bash
$ cd /var/lib/rancher/k3s/agent/etc/containerd/
$ cp config.toml config.toml.tmpl
$ vi config.toml.tmpl
```

```toml
[plugins.cri.registry]
  [plugins.cri.registry.mirrors]
    [plugins.cri.registry.mirrors."192.168.0.69:5001"]
      endpoint = ["http://192.168.0.69:5001"]
  [plugins.cri.registry.configs]
    [plugins.cri.registry.configs."192.168.0.69:5001".tls]
      insecure_skip_verify = true
```

## canister private registry 사용

https://canister.io \
https://canister.freshdesk.com/support/home \
https://canister.freshdesk.com/support/solutions/articles/14000044525-configure-the-docker-cli-for-use-with-canister

```bash
$ docker login --username=myname --password=mypassword cloud.canister.io:5000

$ docker build -t cloud.canister.io:5000/myname/express-test:0.0.2 .
$ docker push cloud.canister.io:5000/myname/express-test:0.0.2
$ docker pull cloud.canister.io:5000/myname/express-test:0.0.2
```
