`python sqlmap.py -u "<url with queries>" --dump`

For requests which include form data:

1. Do the action in burp
2. Go to HTTP history
3. Find the request
4. Right-click in the bottom left request section
5. Click copy to file, put the file in cybertools/sqlmap-1.10.2/burpreq

`python sqlmap.py -r <filename> --dump`. Use `--force-ssl` if website is https.

## "POST parameter 'csrf' appears to hold anti-CSRF token. Do you want sqlmap to automatically update it in further requests? [y/N]"
Y. SQLmap can programmatically grab new csrf tokens to bypass this.

Sometimes the token is in a header or a form field instead:
`python sqlmap.py -r <filename> --dump --force-ssl --csrf-token="X-CSRF-Token"`

Can also add `--csrf-url="http://example.com/login"`, the page SQLMap should visit to grab a fresh token (usually the page that renders the form)