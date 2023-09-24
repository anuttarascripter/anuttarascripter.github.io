<p style="text-align: right">2023-09-24</p>

# Prometheus

https://prometheus.io/ \
https://prometheus.io/docs/introduction/overview/

## Start

https://prometheus.io/docs/introduction/first_steps/

```bash
$ wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
$ tar -xzvf prometheus-2.45.0.linux-amd64.tar.gz

$ ~/prometheus/prometheus-2.45.0.linux-amd64/prometheus
$ curl localhost:9090/metrics
```

## Exporters

https://prometheus.io/docs/instrumenting/exporters/

### Collectd Exporter

https://github.com/prometheus/collectd_exporter

```bash
# cat prometheus.yml
# ...
# scrape_configs:
#   - job_name: "collectd-exporter"
#     static_configs:
#       - labels:
#           exporter: collectd-exporter
#         targets: ["localhost:9103"]

$ ~/prometheus/prometheus-2.45.0.linux-amd64/prometheus --config.file="prometheus.yml"
$ curl localhost:9103/metrics
```

## PromQL

https://prometheus.io/docs/prometheus/latest/querying/basics/
