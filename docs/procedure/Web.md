---
sidebar_position: 3
---

Vulnerabilities that this procedure cannot detect yet:
<details>
[Some SQLi](/docs/general/sqlmap#vulns-that-sqlmap-doesnt-detect)

[XSStrike](/docs/general/XSStrike.md) cannot most XSS vulnerabilities (require further testing with the Burp labs and stuff)

[commix](/docs/general/commix.md) still pending testing on CTF challenges since burp has very limited selection of labs.
</details>

### 0. If the site auto-redirects to a named url like "website.htb" which the browser complains that cannot be found (especially when ur doing HTB or CTF boxes that requires VPN), means u should add that hostname together with the IP address u are given to the /etc/hosts file

## 1. Run gobuster/feroxbuster

```bash
feroxbuster -u <url> -t 1 --rate-limit 1 -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-small-directories.txt -x "txt,html,php,asp,aspx,jsp" -v -k -n -q -e -r -o <output file>
```

Enum all directories with a general wordlist first so that can investigate more. Add them into a list.

Enum subdomains using gobuster only if the scope is *.example.com. [Command WIP]

Then run a catchall enumeration in the background when you're done with all the next steps. (include as one of the final steps) (use the biggest list)

## 2. For all subdomains (can incl in subdomain list if a directory happens to be running a completely different server/stack)
- run whatweb
- `curl -I https://sub.target.com` and look for things like server type (Apache, Nginx, IIS), frameworks (Laravel, Django, Rails), CDNs, WAFs, and interesting response headers

## 3. For all user input fields
- run sqlmap
- run XSStrike