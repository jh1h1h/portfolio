If you see something like this:

![Alternate Data Stream example](./img/ADS-example.png)

Access it like this: `Get-Content <file1> -Stream <file2>` (eg `Get-Content hm.txt -Stream root.txt`)