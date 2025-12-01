# SMB

Connecting (anon): `smbclient -N -L \\\\<IP>\\`, -U to include user (don't include for anonymous), -p for port

List permissions on all shares: `smbmap -H <ip>` (autorecon is supposed to alr run it but its bugged for some reason so just rerun)
<details>
Default shares (for singleing out custom shares for more investigation):

All systems AD and non-AD: ADMIN$, C$/D$, IPC$, PRINT$, Users, Public

AD systems: SYSVOL, NETLOGON
</details>

Download all files: `recurse on` then `mask ""` then `prompt off` then `mget *` after connecting to smbclient

List all dirs recursively: `recurse on` then `ls` after connecting to smbclient



