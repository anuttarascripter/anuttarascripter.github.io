<p style="text-align: right">2023-10-03</p>

# 1. Preparation

https://docs.openstack.org/openstack-ansible/zed/ \
https://docs.openstack.org/openstack-ansible/zed/user/index.html \
https://docs.openstack.org/openstack-ansible/zed/user/test/example.html \
https://docs.openstack.org/project-deploy-guide/openstack-ansible/zed/

## 1.1 Creat Networks

```
- default     : 192.168.122.0/24, DHCP 192.168.122.2-192.168.122.254, NAT
- os-mgmt     : 172.29.236.0/22, DHCP Disabled, isolated
- os-vxlan    : 172.29.240.0/22, DHCP Disabled, isolated
- os-storage  : 172.29.244.0/22, DHCP Disabled, isolated
```

## 1.2 Creat default VM

```
- OS      : Ubuntu 20.04
- CPUs    : 4
- Memory  : 8192 MiB
- Storage : 100 GiB
```

```bash
$ sudo apt update
$ sudo apt install openssh-server net-tools -y
```

## 1.3 Clone VM

### os-deploy

```
- CPUs    : 2
- Memory  : 8192 MiB
- NICs    : default(192.168.122.5), os-mgmt(172.29.236.5)
```

```bash
$ cat /etc/netplan/00-installer-config.yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    enp1s0:
      addresses:
      - 192.168.122.5/24
      gateway4: 192.168.122.1
      nameservers:
        addresses:
        - 8.8.8.8
        search:
        - 8.8.4.4
    enp7s0:
      addresses:
      - 172.29.236.5/22
  version: 2

$ sudo hostnamectl set-hostname deploy
$ hostname
$ reboot
```

```bash
$ cat /etc/hosts
# osa
172.29.236.5      deploy
172.29.236.11     controller
172.29.236.21     compute
172.29.236.31     storage

$ cat /etc/ssh/sshd_config
PermitRootLogin yes

$ sudo passwd root
```

### os-controller

```
- CPUs    : 6
- Memory  : 16384 MiB
- NICs    : default(192.168.122.11), os-mgmt(172.29.236.11), os-vxlan(172.29.240.11), os-storage(172.29.244.11), default

```

```bash
$ cat /etc/netplan/00-installer-config.yaml
# This is the network config written by 'subiquity'
network:
  version: 2
  renderer: networkd
  ethernets:
    enp1s0:
      dhcp4: no
      addresses: [192.168.122.11/24]
      gateway4: 192.168.122.1
      nameservers:
        addresses:
        - 8.8.8.8
        search:
        - 8.8.4.4
    enp7s0:
      dhcp4: no
    enp8s0:
      dhcp4: no
    enp9s0:
      dhcp4: no
    enp10s0:
      dhcp4: no
  bridges:
    br-mgmt:
      interfaces: [enp7s0]
      addresses: [172.29.236.11/22]
    br-vxlan:
      interfaces: [enp8s0]
      addresses: [172.29.240.11/22]
    br-storage:
      interfaces: [enp9s0]
      addresses: [172.29.244.11/22]

$ sudo hostnamectl set-hostname controller
$ hostname
```

### os-compute

```
- CPUs    : 4
- Memory  : 16384 MiB
- NICs    : default(192.168.122.21), os-mgmt(172.29.236.21), os-vxlan(172.29.240.21), os-storage(172.29.244.21), default
```

### os-storage

```
- CPUs    : 2
- Memory  : 8192 MiB
- NICs    : default(192.168.122.31), os-mgmt(172.29.236.31), os-vxlan(172.29.240.31), os-storage(172.29.244.31), default
- Storage : vdb(40 GiB), vdc(20 GiB), vdd(20 GiB), vde(20 GiB)
```

# 2. Prepare the deployment host

https://docs.openstack.org/project-deploy-guide/openstack-ansible/zed/deploymenthost.html

## 2.1 Configuring the operating system

```console
# apt update
# apt dist-upgrade
# reboot

# apt install build-essential git chrony openssh-server python3-dev sudo -y
```

## 2.2 Configure SSH keys

```console
# ssh-keygen
# ssh-copy-id deploy        # generate ~/.ssh/authorized_keys (id_rsa.pub of localhost)
# ssh-copy-id controller
# ssh-copy-id compute
# ssh-copy-id storage
```

## 2.3 Install the source and dependencies

```console
# git clone -b 26.1.2 https://opendev.org/openstack/openstack-ansible /opt/openstack-ansible

# cd /opt/openstack-ansible
# scripts/bootstrap-ansible.sh
```

# 3. Prepare the target hosts

https://docs.openstack.org/project-deploy-guide/openstack-ansible/zed/targethosts.html

## 3.1 Configuring the operating system

```console
# apt update
# apt dist-upgrade
# reboot

# apt install bridge-utils debootstrap openssh-server tcpdump vlan python3 -y
# apt install linux-modules-extra-$(uname -r)
# reboot
```

## 3.2 Configuring the storage

```console
# ssh storage
# fdisk -l
# lsblk
NAME                      MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
...
vdb                       252:16   0   40G  0 disk
vdc                       252:32   0   20G  0 disk
vdd                       252:48   0   20G  0 disk
vde                       252:64   0   20G  0 disk

# pvcreate --metadatasize 2048 /dev/vdb
# vgcreate cinder-volumes /dev/vdb
# pvs
# pvdisplay
# vgs
# lvs
```

# 4. Configure the deployment

https://docs.openstack.org/project-deploy-guide/openstack-ansible/zed/configure.html

## 4.1 Initial environment configuration

```console
# cp -r /opt/openstack-ansible/etc/openstack_deploy /etc/openstack_deploy
# cd /etc/openstack_deploy
# cp openstack_user_config.yml.example openstack_user_config.yml

# cat openstack_user_config.yml
---
cidr_networks:
  container: 172.29.236.0/22
  tunnel: 172.29.240.0/22
  storage: 172.29.244.0/22
...

# cat user_variables.yml
---
debug: True
ssh_delay: 10
...
```

```yaml
# openstack_user_config.yml
---
cidr_networks:
  container: 172.29.236.0/22
  tunnel: 172.29.240.0/22
  storage: 172.29.244.0/22

used_ips:
  - "172.29.236.1,172.29.236.50"
  - "172.29.240.1,172.29.240.50"
  - "172.29.244.1,172.29.244.50"

global_overrides:
  # The internal and external VIP should be different IPs, however they
  # do not need to be on separate networks.
  external_lb_vip_address: 192.168.122.11
  internal_lb_vip_address: 172.29.236.11
  management_bridge: "br-mgmt"
  provider_networks:
    - network:
        container_bridge: "br-mgmt"
        container_type: "veth"
        container_interface: "eth1"
        ip_from_q: "container"
        type: "raw"
        group_binds:
          - all_containers
          - hosts
        is_container_address: true
    - network:
        container_bridge: "br-vxlan"
        container_type: "veth"
        container_interface: "eth10"
        ip_from_q: "tunnel"
        type: "vxlan"
        range: "1:1000"
        net_name: "vxlan"
        group_binds:
          - neutron_openvswitch_agent
    - network:
        container_bridge: "br-ex"
        container_type: "veth"
        container_interface: "eth12"
        host_bind_override: "eth12"
        type: "flat"
        net_name: "physnet"
        group_binds:
          - neutron_openvswitch_agent
    - network:
        container_bridge: "br-storage"
        container_type: "veth"
        container_interface: "eth2"
        ip_from_q: "storage"
        type: "raw"
        group_binds:
          - glance_api
          - cinder_api
          - cinder_volume
          - nova_compute
          - swift_proxy
  #       - ceph-osd
  #       - ceph-rgw

  swift:
    part_power: 8
    storage_network: "br-storage"
    replication_network: "br-storage"
    drives:
      - name: vdc
      - name: vdd
      - name: vde
    mount_point: /srv/node
    storage_policies:
      - policy:
          name: default
          index: 0
          default: True
###
### Infrastructure
###

# galera, memcache, rabbitmq, utility
shared-infra_hosts:
  controller1:
    ip: 172.29.236.11

# repository (apt cache, python packages, etc)
repo-infra_hosts:
  controller1:
    ip: 172.29.236.11

# load balancer
haproxy_hosts:
  controller1:
    ip: 172.29.236.11
###
### OpenStack
###

# keystone
identity_hosts:
  controller1:
    ip: 172.29.236.11

# cinder api services
storage-infra_hosts:
  controller1:
    ip: 172.29.236.11

# glance
image_hosts:
  controller1:
    ip: 172.29.236.11

# placement
placement-infra_hosts:
  controller1:
    ip: 172.29.236.11

# nova api, conductor, etc services
compute-infra_hosts:
  controller1:
    ip: 172.29.236.11

# heat
orchestration_hosts:
  controller1:
    ip: 172.29.236.11

# horizon
dashboard_hosts:
  controller1:
    ip: 172.29.236.11

# neutron server, agents (L3, etc)
network_hosts:
  controller1:
    ip: 172.29.236.11

# nova hypervisors
compute_hosts:
  compute1:
    ip: 172.29.236.21

# cinder storage host (LVM-backed)
storage_hosts:
  storage1:
    ip: 172.29.236.31
    container_vars:
      cinder_backends:
        limit_container_types: cinder_volume
        lvm:
          volume_group: cinder-volumes
          volume_driver: cinder.volume.drivers.lvm.LVMVolumeDriver
          volume_backend_name: LVM_iSCSI
          iscsi_ip_address: "172.29.244.31"

# swift
swift-proxy_hosts:
  storage1:
    ip: 172.29.236.31
    container_vars:
      swift_proxy_vars:
        limit_container_types: swift_proxy
        read_affinity: "r1=100"
        write_affinity: "r1"
        write_affinity_node_count: "1 * replicas"

swift_hosts:
  storage1:
    ip: 172.29.236.31
    container_vars:
      swift_vars:
        limit_container_types: swift
        zone: 0
        region: 1
```

```yaml
# user_variables.yml
---
debug: True
ssh_delay: 10

#lxc_cache_prep_timeout: 3000

openstack_service_publicuri_proto: http
openstack_external_ssl: false
haproxy_ssl: true
rabbitmq_use_ssl: false

horizon_images_upload_mode: legacy

haproxy_keepalived_external_vip_cidr: "192.168.122.11/24"
haproxy_keepalived_internal_vip_cidr: "172.29.236.11/22"
haproxy_keepalived_external_interface: enp1s0
haproxy_keepalived_internal_interface: br-mgmt

neutron_plugin_base:
  - router

openstack_host_specific_kernel_modules:
  - name: "openvswitch"
    pattern: "CONFIG_OPENVSWITCH="
    group: "network_hosts"

neutron_plugin_type: ml2.ovs.dvr
neutron_l2_population: true
neutron_tunnel_types: vxlan

neutron_provider_networks:
  network_flat_networks: "*"
  network_types: "vxlan, flat, vlan"
  network_vxlan_ranges: "10001:20000"
  network_mappings: "public:br-ex"

# swift
swift_allow_all_users: true
glance_default_store: swift
glance_swift_store_auth_address: "{{ keystone_service_internalurl }}"
glance_swift_store_container: glance_images
glance_swift_store_endpoint_type: internalURL
glance_swift_store_key: "{{ glance_service_password }}"
glance_swift_store_region: RegionOne
glance_swift_store_user: "service:glance"

# add zed
swift_storage_address: 172.29.244.31
swift_replication_address: 172.29.244.31
#interface_mapping: br-ex:ens3
neutron_ml2_drivers_type: "local,flat,vlan,vxlan" # for neutron
#neutron_ml2_drivers_type: ["local", "flat", "vlan", "vxlan"] # for horizon
```
