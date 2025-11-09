Active Directory (AD) is a service that allow admins to manage collections of machines at the same time. Each domain is managed by a central machine known as the domain controller (DC).

with sufficient perms, u can just change another user’s pw using `net user <user> <new pw> /domain`

## Core concepts
<details>

powerful groups: Domain Admins, Enterprise Admins

### LDAP
<details>
When we query user or group objects, LDAP is used as the communication channel for the query.

`LDAP://HostName[:PortNumber][/DistinguishedName]`

Hostname: hostname(computer name / IP / domain name) of DC holding the PdcRoleOwner property

(optional) Port: for DC using non-default ports

(optional) Distinguished Name: [here](/docs/general/AD#distinguished-name)
</details>

### Distinguished Name
<details>
Every object has a DN, leftmost is highest hierarchy (like parent or smth) and rightmost is lowest hierarchy. Eg, `CN=Stephanie,CN=Users,DC=corp,DC=com` is a DN for the user Stephanie, as u can see the hierarchy goes from left to right
</details>

### NTLM Auth Steps
<details>
NTLM authentication is used when a client authenticates to a server by IP address (instead of by hostname), or if the user attempts to authenticate to a hostname that is not registered on the Active Directory-integrated DNS server. Likewise, third-party applications may choose to use NTLM authentication instead of Kerberos.

![NTLM Auth Steps](./img/NTLMauth.png)

Step 4 response is encrypted using the hash from step 1. DC already knows NTLM hash of all users.
</details>

### Kerberos Auth Steps
<details>
Default authentication mechanism for modern AD.

![Kerberos Auth Steps](./img/KerberosAuth.png)

Step 1 (AS-REQ): Timestamp encrypted using a hash dervied from the user's password

DC knows the hashes for all users, and decrypts the AS-REQ, checks that the timestamp is valid.

Step 2 (AS-REP): If valid, AS-REP will contain a session key (encrypted using the password hash) and ticket-granting ticket (TGT) (encrypted using krbtgt's hash). By default TGTs are valid for 10h.

When user wants to use a service, DC will be contacted again, initiating Step 3.

Step 3 (TGS-REQ): \{user + timestamp\} (encrypted with session key), resource name, and encrypted TGT. 

DC checks: Timestamp must be valid, username encrypted with session key must match TGT, source IP has to match TGT, then TGS-REP is sent

Step 4 (TGS-REP): name of service granted (encrypted with session key from step 2), new session key (encrypted with session key from step 2), service ticket with username, groups, and new session key (service ticket is encrypted with password hash of service account).

User will then continue auth with the actual service.

Step 5 (AP-REQ): username & timestamp (encrypted with new session key from step 4), and service ticket

Application server decrypts the service ticket to get username, and checks if it matches username from the other part of AP-REQ. Then it will check the groups listed in the service ticket and assign the user the appropriate perms.

[WIP] read and add info from this [link](https://blackhat.com/docs/us-14/materials/us-14-Duckwall-Abusing-Microsoft-Kerberos-Sorry-You-Guys-Don't-Get-It-wp.pdf) about the hash that Kerberos uses in Step 1
</details>

### AD permissions
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

### Default Users
<details>
Administrator, Krbtgt, Guest, some super long SID

(so that when enumerating u can note down the non-default users maybe idk)
</details>

### Miscellaneous
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

## Enumeration
<details>
If can upload stuff
<details>
Upload mimikatz.exe and SharpHound.ps1

Bloodhound/sharphound: [WIP]

Mimikatz: `privilege::debug` first, then `sekurlsa::logonpasswords` for NTLM hash, `sekurlsa::tickets /export` for tickets. `log` to save output to file (for easier searching)
</details>
</details>

## Exploit Methods

### AS-REP Roasting
<details>
Abuses: Step 3 of the [Kerberos Auth Steps](/docs/general/AD#kerberos-auth-steps)

Requires: Known username and password.

Run `impacket-GetNPUsers -dc-ip <domain controller ip> -request -outputfile hashes.asreproast <domain>/<user>` (eg `impacket-GetNPUsers -dc-ip <domain controller ip> -request -outputfile hashes.asreproast corp.com/<user>`)
</details>