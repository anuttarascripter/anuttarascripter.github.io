<p style="text-align: right">2023-10-15</p>

# ip

https://phoenixnap.com/kb/linux-ip-command-examples

https://www.44bits.io/ko/keyword/veth \
https://www.44bits.io/ko/post/container-network-1-uts-namespace \
https://www.44bits.io/ko/post/container-network-2-ip-command-and-network-namespace \
https://www.44bits.io/ko/post/change-root-directory-by-using-chroot

https://devocean.sk.com/blog/techBoardDetail.do?ID=163803 \
https://velog.io/@koo8624/Linux-Linux-Virtual-networking-Interface \
https://blog.naver.com/alice_k106/221305928714 \
https://www.youtube.com/watch?v=6v_BDHIgOY8

https://goduck2.tistory.com/3 \
https://goduck2.tistory.com/4 \
https://goduck2.tistory.com/5 \
https://goduck2.tistory.com/6

```bash
$ ip help
OBJECT := {
    link | address | addrlabel | route | rule | neigh | ntable | tunnel |
    tuntap | maddress | mroute | mrule | monitor | xfrm | netns | l2tp |
    fou | macsec | tcp_metrics | token | netconf | ila | vrf | sr | nexthop
}
```

## ip netns

```bash
$ ip netns help
$ ip netns list
$ sudo ip netns add red
$ sudo ip netns exec red ip link show
```

## ip link

```bash
$ ip link help
TYPE := {
    vlan | veth | vcan | vxcan | dummy | ifb | macvlan | macvtap |
    bridge | bond | team | ipoib | ip6tnl | ipip | sit | vxlan |
    gre | gretap | erspan | ip6gre | ip6gretap | ip6erspan |
    vti | nlmon | team_slave | bond_slave | bridge_slave |
    ipvlan | ipvtap | geneve | vrf | macsec | netdevsim | rmnet | xfrm
}
```

```bash
$ ip link show
$ ip link show lo
$ ip -br link show
$ ip -s link show
$ ip -s link show enp1s0
$ ip -s -s link show enp1s0
$ ip link list up
```

```bash
$ sudo ip link add veth1-r type veth peer veth2-r
$ sudo ip link set veth2-r netns red
$ sudo ip netns exec red ip link set dev veth2-r up
$ sudo ip link set dev veth1-r up
```

```bash
$ sudo ip link add name br0 type bridge
$ sudo ip link set dev veth1-r master br0
$ sudo ip link set dev br0 up
$ ip link show master br0
```

## ip address

```bash
$ ip address help
$ ip address show
$ ip address show dev enp1s0
$ ip -4 address show
$ ip -6 address show
$ sudo ip netns exec red ip address add 192.168.0.1 dev veth2-r
$ sudo ip address add 192.168.0.1/24 dev br0
$ sudo ip address add 192.168.0.1/24 brd 192.168.0.255 dev br0
```

## ip route

```bash
$ ip route help
$ ip route list
$ ip route show table local
$ route -n

$ sudo ip route add 192.168.0.1/32 dev veth1-r
$ sudo ip netns exec red ip route add default via 192.168.0.1 dev veth2-r
```

# iptables

```bash
$ iptables -h
$ iptables -L
$ sudo iptables --list-rules
$ sudo iptables -S
$ sudo ip netns exec red iptables -S

$ sudo iptables -P FORWARD ACCEPT
$ sudo iptables -t nat -A POSTROUTING -s 192.168.0.0/24 ! -o br0 -j MASQUERADE
$ sudo iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -o enp1s0 -j MASQUERADE
$ sudo iptables -t nat -A PREROUTING -m tcp --dport 80 -j DNAT --to 192.168.200.100:80
$ sudo iptables-save > iptables-rules.txt
```
