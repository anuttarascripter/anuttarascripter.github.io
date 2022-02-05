<p style="text-align: right">2022-01-16</p>

## anutt-1.

td-agent.service 파일이 없음. 직접 만들어서 넣어야 되는 것인지 확인

```
$ cd /etc/systemd/system
$ cat td-agent.service
```

For non systemd-based system, use /etc/init.d/td-agent script to start, stop, or restart the agent:

init.d 의 역할 확인

## anutt-2.

권한 문제 발생 \
2022-01-13 04:21:50 +0000 [error]: #0 unexpected error error_class=Errno::EACCES error="Permission denied @ dir_s_mkdir - /var/log/fluent" \
https://github.com/fluent/fluentd/issues/2425

```
$ cat /etc/passwd
$ cat /etc/group
td-agent:x:113:119::/var/lib/td-agent:/usr/sbin/nologin

$ cut -f1 -d: /etc/passwd
$ getent group td-agent
$ sudo usermod -aG adm td-agent
```

https://docs.fluentd.org/v/0.12/deployment/trouble-shooting \
https://joonsei.tistory.com/15

```
$ sudo vi /etc/default/td-agent
```

```
TD_AGENT_OPTIONS=""
TD_AGENT_USER=root
TD_AGENT_GROUP=root
```

결국 권한 777 폴더만들어서 해결

```
$ chmod 777 /home/ubuntu/log
```

# References

https://hidelryn.github.io/2020/05/09/etc-fluentd-2 \
https://smoh.tistory.com/366
