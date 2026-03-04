## /etc/sudoers
Users listed in this file can run `sudo`

## File ownership changes
<details>
`chown` (change owner) — only root can run

`chgrp` (change group) — only owner or root can run

`chmod` (change permissions) — owner or root

`setfacl` (set ACL) — owner or root
</details>

## Process Privileges
<details>
Every process has 4 UIDs:

RUID: actual uid of the user running the current process

EUID: effective UID

SUID (saved setuid): to save prev EUID in case we are overriding EUID temporarily

FSUID: used specifically for filesystem operations (VFS ops)

<br></br>
Setuid bit (on the file perms): EUID of that process will be replaced with UID of file owner

</details>

## uid
root is 0, users begin at 1001

## Capabilities
<details>
### Processes
<details>
A process can modify its own capabilities via `capset()`, `execve()`, or `prctl()`, but can only reduce them (unless it has the appropriate privilege to add capabilities).

Permitted (CapPrm) — the capabilities the process is allowed to use or drop. Acts as a ceiling on what the process can have as effective.

Effective (CapEff) — the capabilities the kernel actually checks when deciding if an operation is allowed. Must be a subset of Permitted.

Inheritable (CapInh) — capabilities that can be passed on to child processes via `execve()`. Note: this doesn't automatically make them effective in the child; the child still needs to activate them.

Bounding (CapBnd) — the absolute maximum set of capabilities a process can ever gain, even if it is root. Acts as a hard ceiling.

Ambient (CapAmb) — introduced in Linux 4.3, used to propagate capabilities to unprivileged child processes (those with UID ≠ 0) across `execve()`.
</details>

### Files
<details>
File capabilities are removed when the file is copied.

Files have Permitted, Inheritable capability sets plus an effective bit (fE). When a file is executed, the new process's capabilities are computed as:
`P'(permitted) = (F(permitted) | (P(inheritable) & F(inheritable)) | P'(ambient)) & P(bounding)`
If EUID = 0: Effective = all Permitted capabilities
If EUID ≠ 0 and fE is OFF: only Ambient capabilities become Effective
If EUID ≠ 0 and fE is ON: Effective = all Permitted capabilities
</details>
</details>