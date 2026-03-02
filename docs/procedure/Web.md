---
sidebar_position: 2
---

Vulnerabilities that this procedure cannot detect yet:
<details>
sqlmap cannot detect https://portswigger.net/web-security/sql-injection/blind/lab-conditional-errors

XSStrike cannot detect stored XSS

XSStrike cannot detect https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink (payload: `"/><script>alert(1)</script><a src="`)
</details>

1. Run gobuster 

Enum all subdomains and directories with a general wordlist first so that can investigate more. Add them into a list.
Then run a catchall enumeration in the background when you're done with all the next steps. (include as one of the final steps)

2. For all subdomains (can incl in subdomain list if a directory happens to be running a completely different server/stack)
- run whatweb
- `curl -I https://sub.target.com` and look for things like server type (Apache, Nginx, IIS), frameworks (Laravel, Django, Rails), CDNs, WAFs, and interesting response headers

3. For all user input fields
- run sqlmap
- run XSStrike