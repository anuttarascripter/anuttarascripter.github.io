<p style="text-align: right">2024-03-22</p>

# Neutron Networking 관련 참고 (2)

# 1. 개요

테스트 서버(165)에 구축되어 있는 Network을 파악하기 위해서 VM에서 외부 인터넷으로 트래픽 흐름을 따라 네트워크 연결을 확인하다.

# 2. Network with the Distributed Virtual Router (DVR)

https://docs.openstack.org/neutron/zed/admin/deploy-ovs-ha-dvr.html

테스트 서버(165)에 구축되어 있는 Neutron Service의 Network 관련 컴포넌트와 연결상태는 아래와 같다. Open vSwitch로 구현된 Bridge들이 트래픽 흐름을 위해서 사용된다. Fixed IP만 할당된 VM에서 외부 인터넷으로 나가는 Network 트래픽 흐름(North-south Scenario 1)은 아래와 같다.

# 3. Network 연결상태 확인

위의 North-south Scenario 1의 Network 트래픽 흐름에 따라 VM 및 Bridge의 연결상태를 확인해 본다.

## 3.1 Instance(1) - Linux Bridge qbr(2)

VM의 Fixed IP로 접속하여 VM의 NIC 정보(fa:16:3e:1a:0a:c6) 확인

```bash
## ip address (vm)
## controller1 node
$ ip netns exec snat-e602072f-be51-4c08-9709-135623c0e03b bash
$ ssh cirros@172.16.31.186

## in vm
$ ip address
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc pfifo_fast qlen 1000
    link/ether fa:16:3e:1a:0a:c6 brd ff:ff:ff:ff:ff:ff
    inet 172.16.31.186/24 brd 172.16.31.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::f816:3eff:fe1a:ac6/64 scope link
       valid_lft forever preferred_lft forever
```

compute1 노드의 VM 리스트 확인 및 연결된 Linux Bridge(qbr42036d13-f3) 와 Port(tap42036d13-f3) 확인

```bash
## virsh list (compute1 node)
## compute1 node
$ virsh list
 Id   Name                State
-----------------------------------
...
 37   instance-00000072   running
 46   instance-00000082   running

$ virsh domiflist instance-00000082
 Interface        Type     Source           Model    MAC
------------------------------------------------------------------------
 tap42036d13-f3   bridge   qbr42036d13-f3   virtio   fa:16:3e:1a:0a:c6

$ ip link show type bridge | grep qbr42036d13-f3
236: qbr42036d13-f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc noqueue state UP mode DEFAULT group default qlen 1000

$ brctl show qbr42036d13-f3
bridge name     bridge id               STP enabled     interfaces
qbr42036d13-f3          8000.6e26f4900e9d       no              qvb42036d13-f3
                                                        tap42036d13-f3

$ ip link show type bridge_slave | grep qbr42036d13-f3
$ ip link show master qbr42036d13-f3
238: qvb42036d13-f3@qvo42036d13-f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc noqueue master qbr42036d13-f3 state UP mode DEFAULT group default qlen 1000
    link/ether 6e:26:f4:90:0e:9d brd ff:ff:ff:ff:ff:ff
240: tap42036d13-f3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc noqueue master qbr42036d13-f3 state UNKNOWN mode DEFAULT group default qlen 1000
    link/ether fe:16:3e:1a:0a:c6 brd ff:ff:ff:ff:ff:ff
```

## 3.2 Linux Bridge qbr(4) - OVS Integration Bridge br-int(5)

위의 NIC 정보(qvb42036d13-f3@qvo42036d13-f3)에서 연결된 br-int 브릿지의 포트가 qvo42036d13-f3인 것을 확인 할 수 있다.

```bash
## ovs-vsctl show (compute1 node)
## compute1 node
$ ovs-vsctl list-br
$ ovs-vsctl show
2b1fb3b1-4aff-490b-9da1-665a0ad360c9
    Manager "ptcp:6640:127.0.0.1"
        is_connected: true
    Bridge br-int
        ...
        Port qvo42036d13-f3
            tag: 21
            Interface qvo42036d13-f3
    ...
```

## 3.3 OVS Integration Bridge br-int(6) - OVS Integration Bridge br-tun(7)

OVS 정보에서 patch 타입으로 연결된 것을 확인할 수 있다.

```bash
## ovs-vsctl show (compute1 node)
## compute1 node
$ ovs-vsctl show
2b1fb3b1-4aff-490b-9da1-665a0ad360c9
    Manager "ptcp:6640:127.0.0.1"
        is_connected: true
    Bridge br-int
        ...
        Port patch-tun
            Interface patch-tun
                type: patch
                options: {peer=patch-int}
    ...
    Bridge br-tun
        ...
        Port patch-int
            Interface patch-int
                type: patch
                options: {peer=patch-tun}
    ...
```

## 3.4 OVS Integration Bridge(Compute) br-tun(8) - OVS Integration Bridge(Network) br-tun(12)

Compute 노드(compute1)에서 vxlan 타입 포트(vxlan-ac1df00b)의 remote_ip와 Network 노드(controller1)에서 vxlan 타입 포트(vxlan-ac1df015)의 remote_ip가 각각 서로를 가리키고 있다.

```bash
## ovs-vsctl show (compute1 node)
## compute1 node
$ ovs-vsctl show
2b1fb3b1-4aff-490b-9da1-665a0ad360c9
    Manager "ptcp:6640:127.0.0.1"
        is_connected: true
    ...
    Bridge br-tun
        ...
        Port vxlan-ac1df00b
            Interface vxlan-ac1df00b
                type: vxlan
                options: {df_default="true", egress_pkt_mark="0", in_key=flow, local_ip="172.29.240.21", out_key=flow, remote_ip="172.29.240.11"}
    ...

$ ip address show br-vxlan
13: br-vxlan: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 52:54:00:26:7e:21 brd ff:ff:ff:ff:ff:ff
    inet 172.29.240.21/22 brd 172.29.243.255 scope global br-vxlan
       valid_lft forever preferred_lft forever
    inet6 fe80::1c89:2fff:feb4:6f69/64 scope link
       valid_lft forever preferred_lft forever
```

```bash
## ovs-vsctl show (controller1 node)
## controller1 node
$ ovs-vsctl show
ce739a12-c2a7-4ec3-9c1c-91a3241b74eb
    Manager "ptcp:6640:127.0.0.1"
        is_connected: true
    ...
    Bridge br-tun
        ...
        Port vxlan-ac1df015
            Interface vxlan-ac1df015
                type: vxlan
                options: {df_default="true", egress_pkt_mark="0", in_key=flow, local_ip="172.29.240.11", out_key=flow, remote_ip="172.29.240.21"}
    ...

$ ip address show br-vxlan
14: br-vxlan: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 52:54:00:a5:ed:10 brd ff:ff:ff:ff:ff:ff
    inet 172.29.240.11/22 brd 172.29.243.255 scope global br-vxlan
       valid_lft forever preferred_lft forever
    inet6 fe80::fca2:f6ff:fe4b:e438/64 scope link
       valid_lft forever preferred_lft forever
```

## 3.5 OVS Integration Bridge br-tun(13) - OVS Integration Bridge br-int(14)

OVS 정보에서 patch 타입으로 연결된 것을 확인할 수 있다.

```bash
## ovs-vsctl show (controller1 node)
## controller1 node
$ ovs-vsctl show
ce739a12-c2a7-4ec3-9c1c-91a3241b74eb
    Manager "ptcp:6640:127.0.0.1"
        is_connected: true
    ...
    Bridge br-int
        ...
        Port patch-tun
            Interface patch-tun
                type: patch
                options: {peer=patch-int}
    ...
    Bridge br-tun
        ...
        Port patch-int
            Interface patch-int
                type: patch
                options: {peer=patch-tun}
    ...
```

## 3.6 OVS Integration Bridge br-int(15) - SNAT Namespace(16)

브릿지 포트와 연결된 SNAT Namespace의 NIC 이름이 같다.

```bash
## ovs-vsctl show (controller1 node)
## controller1 node
$ ovs-vsctl show
ce739a12-c2a7-4ec3-9c1c-91a3241b74eb
    Manager "ptcp:6640:127.0.0.1"
        is_connected: true
    ...
    Bridge br-int
        ...
        Port qg-f803b8a7-5c
            tag: 6
            Interface qg-f803b8a7-5c
                type: internal
    ...


$ ip netns exec snat-e602072f-be51-4c08-9709-135623c0e03b ip link list
...
232: qg-f803b8a7-5c: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/ether fa:16:3e:8a:2b:83 brd ff:ff:ff:ff:ff:ff
...
```

## 3.7 SNAT Namespace(17) - OVS Integration Bridge br-int(18)

브릿지 포트와 연결된 SNAT Namespace의 NIC 이름이 같다.

```bash
## ovs-vsctl show (controller1 node)
## controller1 node
$ ip netns exec snat-e602072f-be51-4c08-9709-135623c0e03b ip link list
...
234: sg-2f4893af-6b: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/ether fa:16:3e:0e:09:fb brd ff:ff:ff:ff:ff:ff

$ ovs-vsctl show
ce739a12-c2a7-4ec3-9c1c-91a3241b74eb
    ...
    Bridge br-int
        ...
        Port sg-2f4893af-6b
            tag: 24
            Interface sg-2f4893af-6b
                type: internal
    ...
```

## 3.8 OVS Integration Bridge br-int(19) - OVS Provider Bridge br-provider(20)

OVS 정보에서 patch 타입으로 연결된 것을 확인할 수 있다.

```bash
## ovs-vsctl show (controller1 node)
## controller1 node
$ ovs-vsctl show
ce739a12-c2a7-4ec3-9c1c-91a3241b74eb
    Manager "ptcp:6640:127.0.0.1"
        is_connected: true
    Bridge br-ovs-public
        ...
        Port port-ovs-public
            Interface port-ovs-public
                type: internal
        Port phy-br-ov9cd114
            Interface phy-br-ov9cd114
                type: patch
                options: {peer=int-br-ov9cd114}
        Port br-ovs-public
            Interface br-ovs-public
                type: internal
    Bridge br-int
        ...
        Port int-br-ov9cd114
            Interface int-br-ov9cd114
                type: patch
                options: {peer=phy-br-ov9cd114}
    ...

$ ovs-vsctl list-ports br-ovs-public
phy-br-ov9cd114
port-ovs-public

$ ip address show br-ovs-public
20: br-ovs-public: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN group default qlen 1000
    link/ether 86:6b:c6:1a:6d:4d brd ff:ff:ff:ff:ff:ff
    inet6 fe80::846b:c6ff:fe1a:6d4d/64 scope link
       valid_lft forever preferred_lft forever

$ ip address show port-ovs-public
21: port-ovs-public: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master br-public state UNKNOWN group default qlen 1000
    link/ether fa:8b:5f:42:11:68 brd ff:ff:ff:ff:ff:ff
```

## 3.9 etc

```bash
$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 iptables-save
$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 iptables -L -n -v -t filter
$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 bash
$ iptables-save

## [add]
$ iptables -N neutron-meter-l-4bcabd70-f5a

$ iptables -A neutron-meter-FORWARD -j neutron-meter-r-4bcabd70-f5a
$ iptables -A neutron-meter-l-4bcabd70-f5a
$ iptables -A neutron-meter-r-4bcabd70-f5a -s 172.16.0.0/24 -o qg-cccce1f6-92 -j neutron-meter-l-4bcabd70-f5a
$ iptables -A neutron-meter-r-4bcabd70-f5a -d 172.16.0.0/24 -i qg-cccce1f6-92 -j neutron-meter-l-4bcabd70-f5a

## [remove]
$ iptables -X neutron-meter-l-4bcabd70-f5a
$ iptables -X neutron-meter-r-4bcabd70-f5a

$ iptables -D neutron-meter-FORWARD -j neutron-meter-r-4bcabd70-f5a
$ iptables -D neutron-meter-l-4bcabd70-f5a
$ iptables -D neutron-meter-r-4bcabd70-f5a -s 172.16.0.0/24 -o qg-cccce1f6-92 -j neutron-meter-l-4bcabd70-f5a
$ iptables -D neutron-meter-r-4bcabd70-f5a -d 172.16.0.0/24 -i qg-cccce1f6-92 -j neutron-meter-l-4bcabd70-f5a

$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 route
$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 ip address show
$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 ssh cirros@172.16.0.174

$ ip netns exec qrouter-0e3414ad-9e12-4d64-8938-163b67e5bd01 iptables-save -t filter
$ ip netns exec qrouter-0e3414ad-9e12-4d64-8938-163b67e5bd01 iptables -t filter -L neutron-meter-l-9e13a8c9-fc9 -nvx
$ ip netns exec qrouter-0e3414ad-9e12-4d64-8938-163b67e5bd01 iptables -L -nvx


$ iptables -t nat -L POSTROUTING -n
$ iptables -h


## create or delete chain
$ iptables -N [chain]
$ iptables -X [chain]

## list rules
$ iptables -t nat -L -n
$ iptables -L -n
$ iptables -L -n -v
$ iptables -L FORWARD 1
$ iptables -S INPUT 1

## append rule
$ iptables -A INPUT -s 127.0.0.1 -p icmp -j DROP

## check rule
$ iptables -C INPUT

## delete rule
$ iptables -D INPUT 1

$ iptables-save > iptables-rules.txt
$ iptables-save

## iptables -A INPUT -s 127.0.0.1 -p icmp -j DROP

## create

$ ip netns list
$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 iptables-save         # neutron-meter-* chain exist
$ ip netns exec qrouter-d5870e05-3184-41be-ac15-36851cf90e86 iptables-save      # neutron-meter-* chain exist & rule created!
-A neutron-meter-r-4e81af42-442 -s 172.16.0.0/24 -o qg-cccce1f6-92 -j neutron-meter-l-4e81af42-442

$ ip netns exec qrouter-d5870e05-3184-41be-ac15-36851cf90e86 iptables -L -n -v -t filter
$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 iptables -L -n -v

$ ip netns exec qrouter-d5870e05-3184-41be-ac15-36851cf90e86 bash
$ iptables -L -n -v

$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 iptables -L -n -v -t filter
$ ip netns exec qrouter-d5870e05-3184-41be-ac15-36851cf90e86 iptables -L -n -v -t filter


$ iptables-save -t filter

$ iptables -A neutron-meter-FORWARD -j neutron-meter-r-472fb253-120
$ iptables -A neutron-meter-l-472fb253-120
$ iptables -A neutron-meter-r-472fb253-120 -s 172.16.0.0/24 -o qg-cccce1f6-92 -j neutron-meter-l-472fb253-120

$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 iptables -L -n -v -t filter
$ ip netns exec snat-d5870e05-3184-41be-ac15-36851cf90e86 ssh cirros@172.16.0.174
```
