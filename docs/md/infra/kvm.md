<p style="text-align: right">2023-09-24</p>

## How to Install Kvm on Ubuntu 20.04

https://linuxize.com/post/how-to-install-kvm-on-ubuntu-20-04/

```bash
$ sudo apt update
$ sudo apt install openssh-server net-tools -y
```

```bash
$ lscpu | grep Virtualization
$ grep -Eoc '(vmx|svm)' /proc/cpuinfo
$ egrep -c '(vmx|svm)' /proc/cpuinfo

$ sudo apt update
# ?? sudo apt upgrade
$ sudo apt install cpu-checker
$ kvm-ok
```

```bash
## method.1 (abstract_programmer:youtube)
$ sudo apt install qemu-kvm
$ sudo apt install libvirt-daemon-system libvirt-clients -y
$ sudo adduser $USER kvm
$ sudo adduser $USER libvirt

$ virsh list --all

$ sudo apt install virt-manager
$ virt-manager

$ sudo apt install bridge-utils
$ brctl show
```

```bash
## method.2
$ sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virtinst virt-manager -y
$ sudo systemctl status libvirtd
$ sudo systemctl is-active libvirtd
# ?? sudo systemctl enable --now libvirtd
# ?? sudo systemctl start libvirtd
```

```bash
$ sudo usermod -aG libvirt $USER
$ sudo usermod -aG kvm $USER
```

```bash
$ wget http://download.cirros-cloud.net/0.5.1/cirros-0.5.1-x86_64-disk.img
$ wget http://download.cirros-cloud.net/0.6.2/cirros-0.6.2-x86_64-disk.img
```
