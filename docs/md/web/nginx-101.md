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

    # reverse proxy
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

### WebSocket Secure (wss) 적용을 위한 reverse proxy 설정

Node.js 서버 앞단에 Nginx를 Proxy 서버로 구성하여 https 서버를 구축한 경우, Websocket에 wss을 적용하기 위해서는 아래와 같은 설정이 필요하다.

```
server {
    listen       443 ssl;
    server_name  www.xxx.com;

    ssl_certificate      /usr/local/nginx/ssl/.../cert.pem;
    ssl_certificate_key  /usr/local/nginx/ssl/.../privkey.pem;

    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    location / {
        proxy_pass http://localhost:5600/;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        # proxy_set_header X-NginX-Proxy true;
        proxy_buffering off;

        # Websocket support
        # nginx_wss_reverse_proxy.conf
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        # proxy_set_header Accept-Encoding "";
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```

https://shinwusub.tistory.com/m/111 \
https://gist.github.com/merong/89dd4a74d29c7c57e0ee739301681fbc
