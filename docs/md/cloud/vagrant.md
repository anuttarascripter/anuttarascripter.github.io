<p style="text-align: right">2023-08-14</p>

# Vagrant

https://www.vagrantup.com \
https://developer.hashicorp.com/vagrant/tutorials \
https://developer.hashicorp.com/vagrant/docs \
https://developer.hashicorp.com/vagrant/docs/providers

```bash
$ vagrant -v
$ vagrant -h
```

https://developer.hashicorp.com/vagrant/docs/other/wsl

```bash
$ export VAGRANT_WSL_ENABLE_WINDOWS_ACCESS="1"
$ export PATH="$PATH:/mnt/c/Program Files/Oracle/VirtualBox"
$ ll "/mnt/c/Program Files/Oracle/VirtualBox"
```

https://developer.hashicorp.com/vagrant/docs \
https://developer.hashicorp.com/vagrant/docs/providers

```bash
$ vagrant box list
$ vagrant box add hashicorp/bionic64  # ubuntu/jammy64

$ vagrant plugin list
$ vagrant ssh-config

$ vagrant init -h
$ vagrant init hashicorp/bionic64     # ubuntu/jammy64
```

### Vagrantfile

https://developer.hashicorp.com/vagrant/docs/vagrantfile/ssh_settings

```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # ssh
  # VirtualBox Host-Only Ethernet Adapter: 192.168.56.1/24
  config.ssh.host = '192.168.56.1'
  # if use key in DrvFs > Permission denied (publickey) :: too open
  config.ssh.insert_key = false
  config.ssh.private_key_path = "~/.vagrant.d/insecure_private_key" # key from wsl

  # vm
  config.vm.box = "hashicorp/bionic64"
  # config.vm.box_version = "1.0.282"
  # virtualbox network:port forwarding rule for wsl
  config.vm.network "forwarded_port", guest: 22, host: 2200, host_ip: "192.168.56.1", id: "ssh"
  # virtualbox on wsl VERR_PATH_NOT_FOUND
  config.vm.provider "virtualbox" do |vb|
    vb.customize [ "modifyvm", :id, "--uartmode1", "disconnected" ]
  end
end
```

```bash
$ vagrant up
$ vagrant status

$ vagrant ssh
$ vagrant ssh default

$ ssh -i ~/.vagrant.d/insecure_private_key -l vagrant -p 2200 192.168.56.1
# options: -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null
# ssh -i c:\Users\meliu\.vagrant.d\insecure_private_key -l vagrant -p 2200 192.168.56.1 # in windows
# ssh-keygen -R [192.168.56.1]:2200

$ vagrant destroy
```
