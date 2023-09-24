<p style="text-align: right">2023-09-24</p>

# collectd

https://collectd.org/

## installation

https://collectd.org/download.shtml \
https://collectd.org/wiki/index.php/First_steps

```bash
$ sudo apt install collectd -y
$ systemctl status collectd
$ sudo systemctl restart collectd

$ collectd -h
$ cat /etc/collectd/collectd.conf
```

## plugins

https://collectd.org/wiki/index.php/Table_of_Plugins

### plugins:write_http

https://collectd.org/wiki/index.php/Plugin:Write_HTTP \
https://github.com/prometheus/collectd_exporter

### plugins:write_prometheus

https://collectd.org/wiki/index.php/Plugin:Write_Prometheus

```bash
$ cat <<EOF > /etc/collectd/collectd.conf.d/write_prometheus.conf
LoadPlugin write_prometheus
<Plugin write_prometheus>
  Port "9103"
</Plugin>
EOF

$ sudo systemctl restart collectd
```

### plugins:virt

https://collectd.org/wiki/index.php/Plugin:virt

```bash
$ cat <<EOF > /etc/collectd/collectd.conf.d/virt.conf
LoadPlugin virt
<Plugin virt>
  Connection "qemu:///system"
  ExtraStats "cpu_util domain_state pcpu vcpu perf vcpupin disk disk_err memory fs_info disk_allocation disk_capacity disk_physical"
  HostnameFormat "uuid"
</Plugin>
EOF

$ sudo systemctl restart collectd
```

https://gurumee92.tistory.com/226 \
https://velog.io/@dojun527/Collectd-virt-plugin으로-Openstack-메트릭-모니터링
