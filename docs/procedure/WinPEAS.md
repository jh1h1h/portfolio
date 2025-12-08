## Search for `[+]`
Look for these symbols and then search how to exploit them.

## Plaintext Pws
under `autologon` section, or search for 'password' or 'creds' in the output

## Section: Services Information
<details>
### Section: Service Permissions and Unquoted Service Paths
`Get-CimInstance Win32_Service | ? {$_.Name -eq "<ServiceName>"} | select Name, StartName, PathName` then `icacls "C:\Program Files\Some App"` for each of the parent folders and see if have modify or full perms. If the StartName is high priv, u can override the exe and then restart the service.

### Section: Interesting Services
<details>
Auto/Manual/Disabled: Auto - on system boot, Manual - find a trigger or start it yourself if u hv perms, Disabled - not startable

Running/Stopped - running means changes will take effect when u restart, stopped means u just gotta start it. nothingburger honestly

look for auto or manual but triggerable. then do `sc qc <service name>` [on cmd] (eg `sc qc bd` if the service says `bd(BarracudaDrive ( bd ) service)["C:\bd\bd.exe"] - Auto - Running`). if its running with `SERVICE_START_NAME` , see if its in the list below:
<details>
Tier 1: These accounts grant you immediate, high-level access on the local machine.

Tier 2: These accounts can lead to domain-level compromise, which is often more valuable than a single machine.

Tier 3: These accounts have significant privileges on the local machine and can often be leveraged for elevation.

| Tier | Account | Description | Why It's Valuable |
|------|---------|-------------|-------------------|
| Tier 1: Highest Value Targets | LocalSystem (or NT AUTHORITY\SYSTEM) | The most powerful local account. Has unrestricted access to the entire local system. | The jackpot. Compromising a service running as SYSTEM gives you full control over the machine. |
| Tier 1: Highest Value Targets | Administrator | The built-in local administrator account. | Effectively the same as SYSTEM for most purposes. Full control over the local machine. |
| Tier 1: Highest Value Targets | MachineName\Administrator | Another local admin account. | Full control over the local machine. |
| Tier 1: Highest Value Targets | Any User in the Administrators group (e.g., DESKTOP-ABC123\John) | A custom local admin account. | Full control over the local machine. |
| Tier 2: High Value Domain Targets | DOMAIN\Domain Admins | A member of the Domain Admins group. | The domain jackpot. Compromising this gives you administrative control over the entire Active Directory domain. |
| Tier 2: High Value Domain Targets | DOMAIN\Account-Name | Any other domain user. | While not a local admin on every machine, this can be used for lateral movement. You can use these credentials with tools like psexec.py or wmiexec.py to see which other machines this user has admin rights on. You can also check their domain privileges with BloodHound. |
| Tier 3: Medium Value Local Accounts | NT AUTHORITY\LOCAL SERVICE | A built-in account with limited privileges on the local computer. It presents anonymous credentials to remote servers. | Has more privileges than a standard user. It can often be leveraged to read sensitive files or, combined with other vulnerabilities, lead to full SYSTEM access. |
| Tier 3: Medium Value Local Accounts | NT AUTHORITY\NETWORK SERVICE | A built-in account similar to LOCAL SERVICE, but it authenticates to remote servers as the computer account (MACHINE$). | Similar to LOCAL SERVICE, but its ability to authenticate over the network as the machine account can be very interesting in a domain environment for Kerberos attacks. |
| Tier 4: Lower Value / Context-Dependent | A Standard User Account (e.g., DESKTOP-ABC123\User123) | A regular, non-privileged local user. | Usually not valuable for local privilege escalation (you can't escalate to a level you're already at). However, it can be useful for persistence (maintaining access) or if that user has privileges on other machines. |
| Tier 4: Lower Value / Context-Dependent | NT AUTHORITY\IUSR, NT SERVICE\AppPool etc. | Built-in accounts for IIS and other services. | Typically have very low privileges. While a service running as one of these is unlikely to be a direct path to SYSTEM, it could be part of a chain of attacks (e.g., reading a web.config file that contains credentials for a more powerful account). |
</details>
</details>
</details>

## Section: Interesting Files and registry
<details>
True positives:

- `.config`, `.xml`, `.ini` files under `C:\Users`, `C:\ProgramData`, etc.
- Plaintext creds like `password=`, `ConnectionString=`
</details>

## Look for "AlwaysInstallElevated"
If both HKLM and HKCU show `AlwaysInstallElevated: 1`, exploit with a malicious .msi. Ignore if only one AlwaysInstallElevated is 1

## Section: Current Token Privileges
<details>
If you see any of these (disabled or enabled don't matter), stop what you're doing and Google "exploit [privilege name]". Tools like JuicyPotato, PrintSpoofer, or RogueWinRM are commonly used for this:
- `SeImpersonatePrivilege`
- `SeManageVolumePrivilege`: https://github.com/CsEnox/SeManageVolumeExploit/releases/tag/public to allow all users to read all directories
- `SeAssignPrimaryPrivilege`
- `SeTcbPrivilege`
- `SeBackupPrivilege`
- `SeRestorePrivilege`
- `SeCreateTokenPrivilege`
- `SeLoadDriverPrivilege`
- `SeDebugPrivilege`
SeShutdownPrivilege is another privilege that allows u to do shutdown /r to restart the machine (if u need it for autostarting services)
</details>

## Section: Checking write permissions in PATH folders
<details>
True positive if writable and appears before `C:\Windows\System32`.

If so, run:

find services that reference `<text>` in path: `Get-CimInstance Win32_Service | Where-Object { $*.PathName -and $*.PathName -match '<text>' } | Select-Object Name,DisplayName,StartName,PathName | Format-List`

find scheduled tasks that have `<string/pattern>`: `schtasks /Query /FO LIST /V | Select-String -Pattern '<pattern>' -CaseSensitive:$false`

find startup/run keys that have `<string/pattern>`: `Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Run,HKCU:\Software\Microsoft\Windows\CurrentVersion\Run -ErrorAction SilentlyContinue | Out-String -Stream | Select-String -Pattern '<pattern>' -CaseSensitive:$false`

If found, then [WIP].
</details>

## Section: Scheduled Applications
[WIP]

