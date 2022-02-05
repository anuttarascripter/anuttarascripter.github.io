<p style="text-align: right">2022-01-18</p>

## nginx 설치

https://docs.nginx.com \
https://docs.nginx.com/nginx/ \
https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/

https://nginx.org/en/linux_packages.html#Ubuntu \
https://nginx.org/en/docs/

https://velog.io/@byjihye/ubuntu2

```bash
$ sudo apt update
$ sudo apt install nginx
```

## Configuration 설정

- name: nginx.conf
- path: [/etc/nginx, /usr/local/nginx/conf, /usr/local/etc/nginx]
- log : [/var/log/nginx, /usr/local/nginx/logs]

<br/>

서버설정 추가

```bash
$ cd /etc/nginx/sites-available
$ sudo vi my_server
```

```
client_max_body_size 75M;

keepalive_timeout 300s;
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
fastcgi_send_timeout 300s;
fastcgi_read_timeout 300s;

map $http_upgrade $connection_upgrade {
    default     "upgrade";
}

server {
        listen 80 default_server;
        listen [::]:80 default_server;

        client_header_timeout 60;
        client_body_timeout   60;
        keepalive_timeout     60;
        gzip                  off;
        gzip_comp_level       4;
        gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

        location / {
              proxy_pass          http://127.0.0.1:5600;
              proxy_http_version  1.1;

              proxy_set_header    Connection          $connection_upgrade;
              proxy_set_header    Upgrade             $http_upgrade;
              proxy_set_header    Host                $host;
              proxy_set_header    X-Real-IP           $remote_addr;
              proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
        }
}
```

symlink 추가로 설정 적용

```bash
$ cd /etc/nginx/sites-enabled
$ sudo ln -s /etc/nginx/sites-available/my_server my_server
```

서비스 재시작

```bash
$ sudo systemctl status nginx.service
$ sudo systemctl stop nginx.service
$ sudo systemctl start nginx.service
```
