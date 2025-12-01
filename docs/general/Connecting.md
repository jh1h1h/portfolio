ssh: `ssh <user>@<ip> -p <port>`

rdp: `xfreerdp /u:<username> /p:<password> /v:<Machine IP> /dynamic-resolution` (to be updated with the /share stuff)

ftp: `ftp <user>@<ip>`, -P for port, user=anonymous for anon login
<details>
to copy all contents from ftp to local machine: `wget -r ftp://<user>:<pw>@<ip>/`, or `wget -r --no-passive ftp://<user>:<pw>@<ip>/`
</details>

postgresql: `psql -h <ip> -p <port> -U <user>`

sql: `mysql -u <user> -p<pw> -h <ip>`, -P for port