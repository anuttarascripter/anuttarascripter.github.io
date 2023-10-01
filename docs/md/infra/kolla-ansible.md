<p style="text-align: right">2023-10-02</p>

# 1. Preparation

## 1.1 Creat Networks

```
- default : 192.168.122.0/24, DHCP 192.168.122.2-192.168.122.254, NAT
- os-mgmt : 10.0.0.0/24, DHCP Disabled, NAT
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

### ka-deploy

```
- CPUs    : 3
- Memory  : 8192 MiB
- NICs    : default, os-mgmt (10.0.0.10)
```

```bash
$ cat /etc/netplan/00-installer-config.yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    #enp1s0:
    #  dhcp4: true
    enp7s0:
      addresses:
      - 10.0.0.10/24
      gateway4: 10.0.0.1
      nameservers:
        addresses:
        - 8.8.8.8
        search:
        - 8.8.4.4
  version: 2

$ sudo hostnamectl set-hostname deploy
$ hostname
$ reboot
```

```bash
$ sudo -i
$ cat <<EOF > /etc/sudoers.d/meil
meil ALL=(ALL) NOPASSWD: ALL
EOF
```

### ka-controller

```
- CPUs    : 5
- Memory  : 16384 MiB
- NICs    : default, os-mgmt (10.0.0.11)
```

### ka-compute

```
- CPUs    : 5
- Memory  : 16384 MiB
- NICs    : default, os-mgmt (10.0.0.31)
```

# 2. Kolla Ansible Quick Start

https://docs.openstack.org/kolla-ansible/zed/user/quickstart.html

## 2.1 Install dependencies (only at ka-deploy)

```bash
$ sudo apt update
$ sudo apt install git python3-dev libffi-dev gcc libssl-dev -y
```

### Install dependencies using a virtual environment

```bash
$ sudo apt install python3-venv
$ python3 -m venv kolla-venv
$ source kolla-venv/bin/activate

$ pip install -U pip
$ pip install 'ansible>=4,<6'
$ ansible --version
ansible [core 2.12.10]
  config file = None
  ...
```

## 2.2 Install Kolla-ansible

### Install Kolla for development

```bash
$ git clone --branch stable/zed https://opendev.org/openstack/kolla-ansible
$ pip install ./kolla-ansible

$ sudo mkdir -p /etc/kolla
$ sudo chown $USER:$USER /etc/kolla

$ cp -r kolla-ansible/etc/kolla/* /etc/kolla
$ cp kolla-ansible/ansible/inventory/* .
```

## 2.3 Install Ansible Galaxy requirements

```bash
$ kolla-ansible install-deps
```

## 2.4 Configure Ansible

```bash
$ cat <<EOF > .ansible.cfg
[defaults]
host_key_checking=False
pipelining=True
forks=100
EOF

$ ansible --version
ansible [core 2.12.10]
  config file = /home/meil/.ansible.cfg
  ...
```

## 2.5 Prepare initial configuration

### ssh key

```bash
$ ssh-keygen
$ ssh-copy-id 10.0.0.10     # generate ~/.ssh/authorized_keys (id_rsa.pub of localhost)
$ ssh-copy-id 10.0.0.11
$ ssh-copy-id 10.0.0.31
```

### Inventory

```bash
$ cat multinode
[control]
#10.0.0.[10:12] ansible_user=ubuntu ansible_password=foobar ansible_become=true
10.0.0.11 ansible_user=meil ansible_become=true

[network:children]
control

[compute]
#10.0.0.[13:14] ansible_user=ubuntu ansible_password=foobar ansible_become=true
10.0.0.31 ansible_user=meil ansible_become=true

[monitoring]
10.0.0.10

[storage:children]
compute

[deployment]
localhost       ansible_connection=local become=true

[baremetal:children]
...

$ ansible -i multinode all -m ping
```

### Kolla passwords (for development)

```bash
$ cd kolla-ansible/tools
$ ./generate_passwords.py
$ cat /etc/kolla/passwords.yml
```

### Kolla globals.yml

```bash
$ cat /etc/kolla/globals.yml
kolla_base_distro: "ubuntu"
openstack_release: "zed"
kolla_internal_vip_address: "10.0.0.11"
network_interface: "enp7s0"
neutron_external_interface: "enp1s0"
enable_openstack_core: "yes"
enable_haproxy: "no"
```

## 2.6 Deployment (for development)

```bash
$ cd kolla-ansible/tools
$ ./kolla-ansible -i ../../multinode bootstrap-servers
$ ./kolla-ansible -i ../../multinode prechecks
$ ./kolla-ansible -i ../../multinode deploy
```

## 2.7 Using OpenStack (for development)

```bash
$ pip install python-openstackclient -c https://releases.openstack.org/constraints/upper/zed

$ cd kolla-ansible/tools
$ ./kolla-ansible post-deploy
$ cat /etc/kolla/clouds.yaml

$ cp /etc/kolla/clouds.yaml ~/.config/openstack/
$ openstack --os-cloud kolla-admin service list

$ export OS_CLOUD=kolla-admin
$ openstack service list

$ cd ~
$ kolla-ansible/tools/init-runonce

$ openstack --os-cloud=kolla-admin server create \
  --image cirros \
  --flavor m1.tiny \
  --key-name mykey \
  --network demo-net \
  demo1
$ openstack server list
```

```bash
$ curl -v http://10.0.0.11
$ cat /etc/kolla/passwords.yml | grep keystone_admin_password
```

## 2.8 OpenStack Setting

```bash
$ ssh meil@10.0.0.11
$ ifconfig enp1s0
$ sudo ifconfig enp1s0 up
```

### Creat a public network at admin

```
> Network
- Name              : public
- Project           : admin
- Network Type      : flat
- Physical Network  : physnet1
- Shared, External Network, Subnet

> Subnet
- Name              : public_subnet
- Network address   : 192.168.122.0/24
- Gateway IP        : 192.168.122.1
- Allocation Pools  : 192.168.122.100,192.168.122.250
- DNS Name Servers  : 8.8.8.8
```

### Creat a private network

```
- private_subnet : 172.16.0.0/24
```
