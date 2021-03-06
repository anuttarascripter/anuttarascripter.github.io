<p style="text-align: right">2022-01-16</p>

# References

https://www.fluentd.org \
https://www.fluentd.org/download \
https://github.com/fluent/fluentd

https://docs.fluentd.org

https://hub.docker.com/r/fluent/fluentd
<br/><br/>

# Before Installation

## Set Up NTP

https://chrony.tuxfamily.org/documentation.html \
https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/set-time.html \
https://hoing.io/archives/3814

```bash
$ sudo apt install chrony
$ sudo vi /etc/chrony/chrony.conf

$ sudo /etc/init.d/chrony restart
$ chronyc sources -v
```

/etc/chrony.conf 에 다음 라인을 추가한다.

```
server 169.254.169.123 prefer iburst minpoll 4 maxpoll 4
```

## Increase the Maximum Number of File Descriptors

```bash
$ ulimit -n
65535
```

/etc/security/limits.conf

```
root soft nofile 65536
root hard nofile 65536
* soft nofile 65536
* hard nofile 65536
```

## Optimize the Network Kernel Parameters

/etc/sysctl.conf

```
net.core.somaxconn = 1024
net.core.netdev_max_backlog = 5000
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_wmem = 4096 12582912 16777216
net.ipv4.tcp_rmem = 4096 12582912 16777216
net.ipv4.tcp_max_syn_backlog = 8096
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 10240 65535
```

## Use sticky bit symlink/hardlink protection

```
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
```

<br/>

# Install by DEB Package (Debian/Ubuntu)

## Installing td-agent

### Step 1: Install from Apt Repository

For Ubuntu Focal

```bash
$ curl -fsSL https://toolbelt.treasuredata.com/sh/install-ubuntu-focal-td-agent4.sh | sh
```

### Step 2: Launch Daemon

Use /lib/systemd/system/td-agent script to start, stop, or restart the agent:

```
$ sudo systemctl start td-agent.service
$ sudo systemctl status td-agent.service
$ sudo systemctl stop td-agent.service
```

To customize systemd behavior, put your td-agent.service in /etc/systemd/system [anutt-1].

### Step 3: Post Sample Logs via HTTP

```
$ curl -X POST -d 'json={"json":"message"}' http://localhost:8888/debug.test
$ tail -n 1 /var/log/td-agent/td-agent.log
$ tail -f /var/log/td-agent/td-agent.log
```

# Post Installation

## System Administration

### Configuration File

```
$ cat /etc/td-agent/td-agent.conf
$ sudo vi /etc/td-agent/td-agent.conf
$ sudo systemctl restart td-agent.service
$ sudo systemctl reload td-agent.service
```

```
<source>
  @type forward
  port 24224
</source>

<source>
  @type http
  port 9880
  bind 0.0.0.0
  body_size_limit 32m
  keepalive_timeout 10s
</source>

<match fluentd.stdout.**>
  @type stdout
</match>

<match fluentd.file.**>
  @type file
  path /home/ubuntu/log/fluent/${tag}/file.%Y%m%d%H%M%S
  <buffer tag,time>
    timekey 30
    timekey_use_utc true
    timekey_wait 10
  </buffer>
</match>

# <match s3.*.*>
<match fluentd.s3.**>
  @type s3

  aws_key_id YOUR_AWS_KEY_ID
  aws_sec_key YOUR_AWS_SECRET_KEY
  s3_bucket YOUR_S3_BUCKET_NAME
  s3_region ap-northeast-2
  path fluent_logs/
  store_as text

  # if you want to use ${tag} or %Y/%m/%d/ like syntax in path / s3_object_key_format,
  # need to specify tag for ${tag} and time for %Y/%m/%d in <buffer> argument.
  <buffer tag,time>
    @type file
    # path /var/log/fluent/s3
    path /home/ubuntu/log/fluent/s3
    timekey 120 # sec
    timekey_wait 1m
    timekey_use_utc true # use utc
    chunk_limit_size 256m
  </buffer>
</match>
```

[anutt-2]

### Logging

```
/var/log/td-agent/td-agent.log
```

<br/><br/>

# Config File Syntax

https://docs.fluentd.org/configuration/config-file

## 1. source: where all the data come from

The source submits events to the Fluentd routing engine. An event consists of three entities.

Tag: The tag is a string separated by dots (e.g. myapp.access), and is used as the directions for Fluentd internal routing engine. It is strongly recommended that you stick to the lower-case alphabets, digits and underscore (e.g. ^[a-z0-9_]+$).

Time: The time field is specified by input plugins, and it must be in the Unix time format.

Record: The record is a JSON object.

### forward

https://docs.fluentd.org/input/forward \
The in_forward Input plugin listens to a TCP socket to receive the event stream. It also listens to a UDP socket to receive heartbeat messages.

```
<source>
  @type forward
  port 24224
  bind 0.0.0.0
</source>
```

### http

https://docs.fluentd.org/input/http \
The in_http Input plugin allows you to send events through HTTP requests. Using this plugin, you can trivially launch a REST endpoint to gather data.

```
<source>
  @type http
  port 9880
  bind 0.0.0.0
  body_size_limit 32m
  keepalive_timeout 10s
</source>
```

```
$ curl -X POST -d 'json={"foo":"bar"}' http://localhost:9880/app.log
```

## 2. match: Tell fluentd what to do!

<br/><br/>

# References

https://docs.fluentd.org/language-bindings/nodejs \
https://github.com/fluent/fluent-logger-forward-node
<br/><br/>

# Node.js package for Fluentd

```
$ npm install @fluent-org/logger
```

<br/><br/>

# References

https://docs.fluentd.org/how-to-guides/apache-to-s3 \
https://docs.fluentd.org/output/s3 \
https://docs.fluentd.org/buffer
<br/><br/>

# Send Apache Logs to S3
