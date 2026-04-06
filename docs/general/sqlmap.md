If you already know the db type: use `--dbms=Oracle` or whatever type it is

`python sqlmap.py -u "<url with queries>" --dump`

For requests which include form data:

1. Do the action in burp
2. Go to HTTP history
3. Find the request
4. Right-click in the bottom left request section
5. Click copy to file, put the file in cybertools/sqlmap-1.10.2/burpreq

`python sqlmap.py -r <filename> --dump`. Use `--force-ssl` if website is https.

Use "*" to denote specific user-input points that you want sqlmap to test (in .txt request files). Make sure to put it right after the =, ignore the console if it says "it seems like you provided empty parameter value"

## "POST parameter 'csrf' appears to hold anti-CSRF token. Do you want sqlmap to automatically update it in further requests? [y/N]"
Y. SQLmap can programmatically grab new csrf tokens to bypass this.

Sometimes the token is in a header or a form field instead:
`python sqlmap.py -r <filename> --dump --force-ssl --csrf-token="X-CSRF-Token"`

Can also add `--csrf-url="http://example.com/login"`, the page SQLMap should visit to grab a fresh token (usually the page that renders the form)

## Vulns that sqlmap doesn't detect
If injection point is within the key string of a JSON in a request.
Like `{"<injection point>": "admin"}`

(Error-based)

https://portswigger.net/web-security/sql-injection/blind/lab-conditional-errors

https://portswigger.net/web-security/sql-injection/blind/lab-sql-injection-visible-error-based

(XML encoding)

https://portswigger.net/web-security/sql-injection/lab-sql-injection-with-filter-bypass-via-xml-encoding

out-of-band labs not tested (burp ones require you to specifically use burp collaborator's domain)

To test next: https://portswigger.net/web-security/sql-injection/blind/lab-time-delays