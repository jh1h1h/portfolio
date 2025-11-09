Active Directory (AD) is a service that allow admins to manage collections of machines at the same time. Each domain is managed by a central machine known as the domain controller (DC).

with sufficient perms, u can just change another user’s pw using `net user <user> <new pw> /domain`

# Core concepts
<details>

powerful groups: Domain Admins, Enterprise Admins

## LDAP
<details>
When we query user or group objects, LDAP is used as the communication channel for the query.

`LDAP://HostName[:PortNumber][/DistinguishedName]`

Hostname: hostname(computer name / IP / domain name) of DC holding the PdcRoleOwner property

(optional) Port: for DC using non-default ports

(optional) Distinguished Name: [here](/docs/general/AD#distinguished-name)
</details>

## Distinguished Name
<details>
Every object has a DN, leftmost is highest hierarchy (like parent or smth) and rightmost is lowest hierarchy. Eg, `CN=Stephanie,CN=Users,DC=corp,DC=com` is a DN for the user Stephanie, as u can see the hierarchy goes from left to right
</details>

## NTLM Auth Steps
<details>
![NTLM Auth Steps](./img/NTLMauth.png)
</details>

## Kerberos Auth Steps
<details>
![Kerberos Auth Steps](./img/KerberosAuth.png)
</details>

## AD permissions
<details>
[Highest] GenericAll: Full permissions on object

GenericWrite: Edit certain attributes on the object

WriteOwner: Change ownership of the object

WriteDACL: Edit ACE's applied to object

AllExtendedRights: Change password, reset password, etc.

ForceChangePassword: Password change for object

Self (Self-Membership): Add ourselves to for example a group

(more…)[https://learn.microsoft.com/en-us/windows/win32/secauthz/access-rights-and-access-masks]
</details>

Default Users (so that when enumerating u can note down the non-default users maybe idk)
<details>
Administrator, Krbtgt, Guest, some super long SID
</details>

Other misc stuff idk where to put these
<details>
https://learn.microsoft.com/en-us/dotnet/api/system.directoryservices?view=windowsdesktop-9.0

DirectoryEntry class encapsulates an AD object
<details>
```powershell
$PDC = [System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().PdcRoleOwner.Name
$DN = ([adsi]'').distinguishedName
$LDAP = "LDAP://$PDC/$DN"

$direntry = New-Object System.DirectoryServices.DirectoryEntry($LDAP)
```
</details>
DirectorySearcher class performs queries against AD
<details>
```powershell
$dirsearcher = New-Object System.DirectoryServices.DirectorySearcher($direntry)
$dirsearcher.filter="samAccountType=805306368" #Users
$dirsearcher.FindAll()
```
</details>

</details>
</details>

# Enumeration
<details>
If can upload stuff
<details>
Upload mimikatz.exe and SharpHound.ps1

Bloodhound/sharphound: [WIP]

Mimikatz: `privilege::debug` first, then `sekurlsa::logonpasswords` for NTLM hash, `sekurlsa::tickets /export` for tickets. `log` to save output to file (for easier searching)
</details>
</details>

# Exploit Methods

## AS-REP Roasting
<details>
Abuses: Step 3 of the [Kerberos Auth Steps](/docs/general/AD#kerberos-auth-steps)

Requires: Known username and password.

Run `impacket-GetNPUsers -dc-ip <domain controller ip> -request -outputfile hashes.asreproast <domain>/<user>` (eg `impacket-GetNPUsers -dc-ip <domain controller ip> -request -outputfile hashes.asreproast corp.com/<user>`)
</details>