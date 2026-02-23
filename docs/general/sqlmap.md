`python sqlmap.py -u "<url with queries>" --dump`

For requests which include form data:

1. Do the action in burp
2. Go to HTTP history
3. Find the request
4. Right-click in the bottom left request section
5. Click copy to file, put the file in cybertools/sqlmap-1.10.2/burpreq

`python sqlmap.py -r <filename> --dump`