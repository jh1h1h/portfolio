---
sidebar_position: 2
---

1. Run gobuster 

Enum all subdomains and directories with a general wordlist first so that can investigate more. Add them into a list.
Then run a catchall enumeration in the background when you're done with all the next steps. (include as one of the final steps)

2. For all subdomains (can incl in subdomain list if a directory happens to be running a completely different server/stack)
- run whatweb
- `curl -I https://sub.target.com` and look for things like server type (Apache, Nginx, IIS), frameworks (Laravel, Django, Rails), CDNs, WAFs, and interesting response headers

3. 