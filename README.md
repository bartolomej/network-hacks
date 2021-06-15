# Network hacks

A few scripts made for fun to explore network protocols.

### FTP bruteforce

This script automatically scans for hosts with open FTP ports on your network 
using [nmap](https://nmap.org/) and launches a bruteforce attack using [Hydra tool](https://github.com/vanhauser-thc/thc-hydra). Common passwords & usernames dataset is taken from [SecList](https://github.com/danielmiessler/SecLists).

### Host info

Display info of the current host.

```bash
$ node host-info.js <net-interface>
IP: 192.168.64.109
MASK: 24
```

### Open port scan

Scan the local network for hosts with open ports.

```bash
$ node port-scan.js
192.168.64.1 has 7 open ports (21: ftp/tcp, 139: netbios-ssn/tcp, 443: https/tcp, 445: microsoft-ds/tcp, 5431: park-agent/tcp, 8022: oa-system/tcp, 8443: https-alt/tcp)
192.168.64.102 has 2 open ports (593: http-rpc-epmap/tcp, 7000: afs3-fileserver/tcp)

2 hosts total
```
